import { Game, MapState } from "./index";
import { createRandomBox } from "./box";
import { intervalTimer } from "./utils";

export const enum PropType {
  FILL,
  GET_STRIP,
  SPEED_UP,
  SPEED_DOWN,
  DISABLE_ROTATE,
}

export const props: PropType[] = [
  PropType.FILL,
  PropType.SPEED_DOWN,
  PropType.GET_STRIP,
  PropType.SPEED_UP,
  PropType.DISABLE_ROTATE,
];

export const buffProps: PropType[] = [
  PropType.FILL,
  PropType.SPEED_DOWN,
  PropType.GET_STRIP,
];

export const deBuffProps: PropType[] = [
  PropType.SPEED_UP,
  PropType.DISABLE_ROTATE,
];

export function fillProp(map: number[][]) {
  let num = 0,
    row = map.length - 1,
    col = map[0].length - 1;
  for (let i = row; i >= 0; i--) {
    for (let j = 0; j < col; j++) {
      if (map[i][j] === MapState.EMPTY) {
        map[i][j] = MapState.FILLED;
        num++;
        if (num == 3) break;
      }
    }
    if (num == 3) break;
  }
}

export function getStripProp(game: Game) {
  game.nextBox.value = createRandomBox(0);
}

export function changeSpeedProp(game: Game, speed: number) {
  game.interval = intervalTimer(speed);
  let i = 0;
  const fb = () => {
    i++;
    if (i == 3) {
      game.interval = intervalTimer(game.speed);
      game.off("createBox", fb);
    }
  };
  game.on("createBox", fb);
}

export function disableNextBoxRotateProp(game: Game) {
  if (game.nextBox.value) {
    game.nextBox.value.canRotate = false;
  }
}
