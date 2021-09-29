export * from "./box";
export * from "./map";

import { hitBottomBoundary, hitLeftBoundary, hitRightBoundary } from "./hit";
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
  paused,
}

export enum GameMode {
  single,
  multiple,
}

export type Game = {
  map: number[][];
  state: GameState;
  // 单人模式或多人模式，涉及道具的发放
  mode: GameMode;
  // 主动与被动模式，被动模式不自动下落和创建box，用来播放对手的界面
  passive: boolean;
  score: Ref<number>;
  interval: Function;
  activeBox: Box | null;
  nextBox: Ref<Box | null>;

  // 状态控制
  startGame: (mode: GameMode) => void;
  pauseGame: () => void;
  continueGame: () => void;
  endGame: () => void;

  // 游戏控制
  rotateBox: () => void;
  moveDown: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  fallDown: () => void;
  createBox: (
    destineType: number,
    destineDirection: number,
    nextDestineType: number,
    nextDestineDirection: number
  ) => void;

  // 钩子，用于同步对手界面
  onCreateBox?: (
    type: number,
    direction: number,
    nextType: number,
    nextDirection: number
  ) => void;
  onEnd?: () => void;
  onTicker?: () => void;
};

export function createGame(options: any) {
  const game: Game = {
    map: reactive(initMap(options.row, options.col)),
    state: GameState.unStarted,
    mode: GameMode.single,
    passive: options.passive,
    score: ref(0),
    interval: intervalTimer(options.interval),
    activeBox: null,
    nextBox: ref(null),

    startGame(mode: GameMode) {
      if (game.state !== GameState.started) {
        // 清理数据
        game.score.value = 0;
        cleanMap(game.map);

        // 设置模式状态
        game.mode = mode;
        game.state = GameState.started;

        // 被动模式不自动下落和创建box
        if (!game.passive) {
          createBox(game);
          addTicker((n: number) => {
            if (game.state === GameState.started) {
              if (game.interval(n)) {
                game.onTicker?.();
                moveDown(game);
              }
            }
          });
          // todo 多次requestAnimationFrame可能会重复运行，待优化
          startTicker();
        }
      }
    },
    endGame() {
      game.state = GameState.unStarted;
    },
    pauseGame() {
      game.state = GameState.paused;
    },
    continueGame() {
      game.state = GameState.started;
    },
    rotateBox() {
      game.activeBox!.rotate(game.map);
      render(game.map, game.activeBox!);
    },
    moveDown() {
      moveDown(game);
    },
    moveLeft() {
      moveLeft(game.map, game.activeBox!);
    },
    moveRight() {
      moveRight(game.map, game.activeBox!);
    },
    fallDown() {
      moveDown(game, true);
    },
    createBox(...args: number[]) {
      createBox(game, ...args);
    },
  };
  return game;
}

export function createBox(
  game: Game,
  destineType?: number,
  destineDirection?: number,
  nextDestineType?: number,
  nextDestineDirection?: number
) {
  game.activeBox =
    game.nextBox.value ?? createRandomBox(destineType, destineDirection);
  game.nextBox.value = createRandomBox(nextDestineType, nextDestineDirection);
  // 调用创建box的钩子
  game.onCreateBox?.(
    game.activeBox.typeIndex,
    game.activeBox.directionIndex,
    game.nextBox.value.typeIndex,
    game.nextBox.value?.directionIndex
  );

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
    render(map, box);
  }
}

export function moveRight(map: number[][], box: Box) {
  if (!hitRightBoundary(map, box.x, box.y, box.rightPoints)) {
    box.x++;
    render(map, box);
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
    render(game.map, game.activeBox!);
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
      game.state = GameState.unStarted;
      game.onEnd?.();
      return;
    }
    // 主动模式，自动创建下一个box
    if (!game.passive) {
      createBox(game);
    }
  }
}

export function setScore(rows: number, game: Game) {
  if (rows > 0) {
    game.score.value += rows * 10;
  }
}
