import { buffProps, Game, GameMode, GameState, PropType } from "../game";
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
  cancelReady() {
    this.state.value = PlayerState.unStarted;
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
  releaseProp(propType: PropType, index?: number) {
    this.game.releaseProp(propType, index);
  }
}

export class MySelf extends Player {
  constructor(game: Game, onEnd: () => void) {
    super(game);
    this.game.on("ticker", () => {
      this.emit("rivalGame", "moveDown");
    });
    this.game.on("createBox", (...args: any[]) => {
      this.emit("rivalGame", "createBox", ...args);
    });
    this.game.on("end", () => {
      this.emit("rivalGame", "end");
      this.state.value = PlayerState.ended;
      onEnd();
    });

    message.on("game", (msg: string, ...args: any[]) => {
      switch (msg) {
        case "start":
          super.start(GameMode.multiple);
          break;
        case "releaseProp":
          if (this.game.state === GameState.started) {
            // @ts-ignore
            super.releaseProp(...args);
          }
          break;
      }
    });
  }

  start(model: GameMode) {
    if (model === GameMode.multiple) {
      message.emit("game", "start");
      message.emit("rivalGame", "start");
    }
    super.start(model);
  }

  ready() {
    message.emit("rivalGame", "ready");
    super.ready();
  }

  cancelReady() {
    message.emit("rivalGame", "cancelReady");
    super.cancelReady();
  }

  handleMoveLeft() {
    this.emit("rivalGame", "moveLeft");
    super.handleMoveLeft();
  }

  handleMoveDown() {
    this.emit("rivalGame", "moveDown");
    super.handleMoveDown();
  }

  handleMoveRight() {
    this.emit("rivalGame", "moveRight");
    super.handleMoveRight();
  }

  handleRotate() {
    this.emit("rivalGame", "rotateBox");
    super.handleRotate();
  }

  handleFallDown() {
    this.emit("rivalGame", "fallDown");
    super.handleFallDown();
  }

  releaseProp(propType: PropType, index: number) {
    if (buffProps.indexOf(propType) > -1) {
      super.releaseProp(propType, index);
      this.emit("rivalGame", "releaseProp", propType);
    } else {
      this.game.removeProp(index);
      this.emit("game", "releaseProp", propType);
    }
  }

  emit(...args: any[]) {
    if (this.game.mode === GameMode.multiple) {
      message.emit(...args);
    }
  }
}

export class Rival extends Player {
  onlineState: Ref<boolean> = ref(false);

  constructor(game: Game, onEnd: () => void) {
    super(game);
    message.on("rivalOnline", () => {
      this.onlineState.value = true;
      information("朋友已上线");
    });
    message.on("rivalOffline", () => {
      this.game.endGame();
      this.state.value = PlayerState.unStarted;
      this.onlineState.value = false;
      information("朋友已下线");
    });

    message.on("rivalGame", (msg: string, ...args: any[]) => {
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
        case "releaseProp":
          // @ts-ignore
          this.releaseProp(...args);
          break;
        case "end":
          this.endGame();
          onEnd();
          break;
        case "ready":
          this.ready();
          break;
        case "cancelReady":
          this.cancelReady();
          break;
      }
    });
  }

  handleCreateBox(...args: number[]) {
    // @ts-ignore
    this.game.createBox(...args);
  }
}
