import { Game } from "../game";
import { message } from "./message";

export class Player {
  game: Game;
  constructor(game: Game) {
    this.game = game;
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
  constructor(game: Game) {
    super(game);
  }

  handleMoveLeft() {
    super.handleMoveLeft();
    message.emit("game", "moveLeft");
  }

  handleMoveDown() {
    super.handleMoveDown();
    message.emit("game", "moveDown");
  }

  handleMoveRight() {
    super.handleMoveRight();
    message.emit("game", "moveRight");
  }

  handleRotate() {
    super.handleRotate();
    message.emit("game", "rotateBox");
  }

  handleFallDown() {
    super.handleFallDown();
    message.emit("game", "fallDown");
  }
}

export class Rival extends Player {
  constructor(game: Game) {
    super(game);
    message.on("game", (msg: string) => {
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
      }
    });
  }
}
