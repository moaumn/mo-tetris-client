import { Game, GameMode, GameState } from "../game";
import { message } from "./message";
import { Ref, ref } from "vue";
import { information } from "./utils";

export const enum PlayerState {
  unStarted,
  readied,
  started,
  paused,
  ended,
}

export class Player {
  protected game: Game;
  state: Ref<PlayerState> = ref(PlayerState.unStarted);
  constructor(game: Game) {
    this.game = game;
  }
  ready() {
    this.state.value = PlayerState.readied;
  }
  start(mode: GameMode) {
    this.state.value = PlayerState.started;
    this.game.startGame(mode);
  }
  pause() {
    this.state.value = PlayerState.paused;
    this.game.pauseGame();
  }
  endGame() {
    this.state.value = PlayerState.ended;
    this.game.endGame();
  }
  continueGame() {
    this.state.value = PlayerState.started;
    this.game.continueGame();
  }
  handleMoveLeft() {
    this.game.moveLeft();
  }
  handleMoveDown() {
    this.game.moveDown();
  }
  handleMoveRight() {
    this.game.moveRight();
  }
  handleRotate() {
    this.game.rotateBox();
  }
  handleFallDown() {
    this.game.fallDown();
  }
}

export class MySelf extends Player {
  constructor(game: Game, onEnd: () => void) {
    super(game);
    this.game.onTicker = () => {
      this.emit("game", "moveDown");
    };
    this.game.onCreateBox = (...args) => {
      this.emit("game", "createBox", ...args);
    };
    this.game.onEnd = () => {
      this.emit("game", "end", this.game.score);
      this.state.value = PlayerState.ended;
      onEnd();
    };
    message.on("game", (msg: string, ...args: any[]) => {
      switch (msg) {
        case "start":
          super.start(GameMode.multiple);
          break;
        case "end":
          this.endGame();
          onEnd();
      }
    });
  }

  start(model: GameMode) {
    message.emit("game", "start");
    super.start(model);
  }

  ready() {
    message.emit("game", "ready");
    super.ready();
  }

  handleMoveLeft() {
    this.emit("game", "moveLeft");
    super.handleMoveLeft();
  }

  handleMoveDown() {
    this.emit("game", "moveDown");
    super.handleMoveDown();
  }

  handleMoveRight() {
    this.emit("game", "moveRight");
    super.handleMoveRight();
  }

  handleRotate() {
    this.emit("game", "rotateBox");
    super.handleRotate();
  }

  handleFallDown() {
    this.emit("game", "fallDown");
    super.handleFallDown();
  }

  emit(...args: any[]) {
    if (this.game.mode === GameMode.multiple) {
      message.emit(...args);
    }
  }
}

export class Rival extends Player {
  onlineState: Ref<boolean> = ref(false);

  constructor(game: Game) {
    super(game);
    message.on("rivalOnline", () => {
      this.onlineState.value = true;
      information("朋友已上线");
    });
    message.on("rivalOffline", () => {
      this.state.value = PlayerState.unStarted;
      this.onlineState.value = false;
      information("朋友已下线");
    });

    message.on("game", (msg: string, ...args: any[]) => {
      switch (msg) {
        case "moveLeft":
          this.handleMoveLeft();
          break;
        case "moveRight":
          this.handleMoveRight();
          break;
        case "moveDown":
          this.handleMoveDown();
          break;
        case "rotateBox":
          this.handleRotate();
          break;
        case "fallDown":
          this.handleFallDown();
          break;
        case "createBox":
          this.handleCreateBox(...args);
          break;
        case "start":
          this.start(GameMode.multiple);
          break;
        case "end":
          this.endGame();
          break;
        case "ready":
          this.ready();
          break;
      }
    });
  }

  handleCreateBox(...args: number[]) {
    // @ts-ignore
    this.game.createBox(...args);
  }
}
