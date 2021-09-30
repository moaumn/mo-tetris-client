import { Observer } from "../common/observer";
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
} from "./map";
import { intervalTimer } from "./utils";
import { render } from "./renderer";
import {
  buffProps,
  changeSpeedProp,
  disableNextBoxRotateProp,
  fillProp,
  getStripProp,
  props,
  PropType,
} from "./prop";

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
  speed: number;
  interval: Function;
  activeBox: Box | null;
  nextBox: Ref<Box | null>;
  props: Ref<PropType[]>;

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

  // 游戏道具
  releaseProp: (propType: PropType, index?: number) => void;
  removeProp: (index: number) => void;

  // 事件用于同步对手界面
  on: (event: string, callback: Function) => void;
  off: (event: string, callback: Function) => void;
  dispatch: (event: string, ...args: any[]) => void;
};

export function createGame(options: any) {
  const observer = new Observer();

  const game: Game = {
    map: reactive(initMap(options.row, options.col)),
    state: GameState.unStarted,
    mode: GameMode.single,
    passive: options.passive,
    score: ref(0),
    speed: options.interval,
    interval: intervalTimer(options.interval),
    activeBox: null,
    nextBox: ref(null),
    props: ref([
      PropType.FILL,
      PropType.GET_STRIP,
      PropType.SPEED_DOWN,
      PropType.SPEED_UP,
      PropType.DISABLE_ROTATE,
    ]),
    on: observer.on.bind(observer),
    off: observer.off.bind(observer),
    dispatch: observer.dispatch.bind(observer),
    startGame(mode: GameMode) {
      if (game.state !== GameState.started) {
        // 清理数据
        game.score.value = 0;
        game.props.value = [];
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
                game.dispatch("ticker");
                moveDown(game);
              }
            }
          });
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
    releaseProp(propType: PropType, index?: number) {
      props[propType]();
      if (typeof index !== "undefined") {
        game.props.value.splice(index, 1);
      }
    },
    removeProp(index: number) {
      game.props.value.splice(index, 1);
    },
  };

  const props = {
    [PropType.FILL]: () => {
      fillProp(game.map);
      const rows = removeFilledRow(game.map, 3);
      setScore(rows, game, true);
    },
    [PropType.GET_STRIP]: () => getStripProp(game),
    [PropType.SPEED_UP]: () => changeSpeedProp(game, 500),
    [PropType.SPEED_DOWN]: () => changeSpeedProp(game, 2000),
    [PropType.DISABLE_ROTATE]: () => disableNextBoxRotateProp(game),
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

  // 发射创建box事件
  game.dispatch(
    "createBox",
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
    // 道具奖励
    rewardProp(rows, game);
    // 检查游戏结束
    if (checkGameOver(game.map)) {
      game.state = GameState.unStarted;
      game.dispatch("end");
      return;
    }
    // 主动模式，自动创建下一个box
    if (!game.passive) {
      createBox(game);
    }
  }
}

export function setScore(rows: number, game: Game, useProp = false) {
  if (rows === 0) return;

  if (useProp) {
    game.score.value += rows * 100;
  } else {
    switch (rows) {
      case 1:
        game.score.value += 100;
        break;
      case 2:
        game.score.value += 300;
        break;
      case 3:
        game.score.value += 500;
        break;
      case 4:
        game.score.value += 800;
        break;
    }
  }
}

export function rewardProp(rows: number, game: Game) {
  if (rows === 0 || game.props.value.length >= 6) return;
  const rate = { 1: 1, 2: 3, 3: 6, 4: 10 };
  const random = Math.random() * 10;
  // @ts-ignore
  if (random < rate[rows]) {
    if (game.mode === GameMode.single) {
      const propIndex = Math.trunc(Math.random() * buffProps.length);
      game.props.value.push(buffProps[propIndex]);
    } else {
      const propIndex = Math.random() * props.length;
      game.props.value.push(props[propIndex]);
    }
  }
}
