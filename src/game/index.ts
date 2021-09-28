import { hitBottomBoundary, hitLeftBoundary, hitRightBoundary } from "./hit";

export * from "./box";
export * from "./map";

import { addTicker, startTicker } from "./ticker";
import { Box, createRandomBox } from "./box";
import { reactive, ref, Ref } from "vue";
import {
  addBoxToMap,
  checkGameOver,
  cleanMap,
  initMap,
  removeFilledRow,
} from "../game";
import { intervalTimer } from "./utils";
import { render } from "./renderer";

export enum GameState {
  unStarted,
  started,
  ended,
  paused,
}

export type Game = {
  map: number[][];
  state: Ref<GameState>;
  score: Ref<number>;
  center: number;
  interval: Function;
  activeBox: Box | null;
  nextBox: Ref<Box | null>;
  startGame: Function;
  rotateBox: Function;
  moveDown: Function;
  moveLeft: Function;
  moveRight: Function;
  fallDown: Function;
};

export function createGame(options: any) {
  const game: Game = {
    map: reactive(initMap(options.row, options.col)),
    score: ref(0),
    state: ref(GameState.unStarted),
    center: Math.trunc(options.col / 2),
    interval: intervalTimer(options.interval),
    activeBox: null,
    nextBox: ref(null),

    startGame() {
      // 重新开始游戏，清空数据
      if (game.state.value === GameState.ended) {
        game.score.value = 0;
        cleanMap(game.map);
      }
      game.state.value = GameState.started;
      createBox(game);
      addTicker((n: number) => {
        if (game.state.value === GameState.started) {
          if (game.interval(n)) {
            moveDown(game);
            render(game.map, game.activeBox!);
          }
        }
      });
      startTicker();
    },
    rotateBox() {
      game.activeBox!.rotate(game.map);
      render(game.map, game.activeBox!);
    },
    moveDown() {
      moveDown(game);
      render(game.map, game.activeBox!);
    },
    moveLeft() {
      moveLeft(game.map, game.activeBox!);
      render(game.map, game.activeBox!);
    },
    moveRight() {
      moveRight(game.map, game.activeBox!);
      render(game.map, game.activeBox!);
    },
    fallDown() {
      moveDown(game, true);
      render(game.map, game.activeBox!);
    },
  };
  return game;
}

export function createBox(game: Game) {
  game.activeBox = game.nextBox.value ?? createRandomBox();
  game.nextBox.value = createRandomBox();
  // 横向居中
  game.activeBox.x = Math.trunc(
    (game.map[0].length - game.activeBox.shape[0].length) / 2
  );
  // 置于顶端
  const yArray = game.activeBox.bottomPoints.map((item) => item.y);
  game.activeBox.y = -Math.max(...yArray);

  render(game.map, game.activeBox);
}

export function moveLeft(map: number[][], box: Box) {
  if (!hitLeftBoundary(map, box.x, box.y, box.leftPoints)) {
    box.x--;
  }
}

export function moveRight(map: number[][], box: Box) {
  if (!hitRightBoundary(map, box.x, box.y, box.rightPoints)) {
    box.x++;
  }
}

export function moveDown(game: Game, recursive = false) {
  if (
    !hitBottomBoundary(
      game.map,
      game.activeBox!.x,
      game.activeBox!.y,
      game.activeBox!.bottomPoints
    )
  ) {
    game.activeBox!.y++;
    if (recursive) {
      moveDown(game, true);
    }
  } else {
    // box上屏
    addBoxToMap(game.map, game.activeBox!);
    // 删除满行
    const rows = removeFilledRow(game.map, game.activeBox!);
    // 记分
    setScore(rows, game);
    // 检查游戏结束
    if (checkGameOver(game.map)) {
      game.state.value = GameState.ended;
    }
    // 创建下一个box
    createBox(game);
  }
}

export function setScore(rows: number, game: Game) {
  if (rows > 0) {
    game.score.value += rows * 10;
  }
}
