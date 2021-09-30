import { Box } from "./box";
import { MapState } from "./map";

export function render(map: number[][], box: Box) {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] & MapState.ACTIVE_BOX) {
        map[i][j] = MapState.EMPTY;
      }
    }
  }

  for (let i = 0; i < box.shape.length; i++) {
    for (let j = 0; j < box.shape[i].length; j++) {
      if (box.shape[i][j] === 1) {
        const x = box.x + j;
        const y = box.y + i;
        if (map[y]) {
          map[y][x] = box.canRotate
            ? MapState.NORMAL_BOX
            : MapState.DISABLE_ROTATE_BOX;
        }
      }
    }
  }
}
