import { Box } from "./box";

export enum MapState {
  EMPTY = 1,
  NORMAL_BOX = 1 << 1,
  DISABLE_ROTATE_BOX = 1 << 2,
  FILLED = 1 << 3,
  ACTIVE_BOX = NORMAL_BOX | DISABLE_ROTATE_BOX,
}

export function initMap(row: number, col: number) {
  const map = Array(row);
  for (let i = 0; i < map.length; i++) {
    map[i] = Array(col).fill(MapState.EMPTY);
  }
  return map;
}

export function addBoxToMap(map: number[][], box: Box) {
  for (let i = 0; i < box.shape.length; i++) {
    for (let j = 0; j < box.shape[i].length; j++) {
      if (box.shape[i][j] === 1) {
        const x = box.x + j;
        const y = box.y + i;
        if (map[y]) {
          map[y][x] = MapState.FILLED;
        }
      }
    }
  }
}

function _removeFilledRow(map: number[][], rowIndex: number) {
  if (
    map[rowIndex] &&
    map[rowIndex].every((item) => item === MapState.FILLED)
  ) {
    const newRow = Array(map[rowIndex].length).fill(MapState.EMPTY);
    map.splice(rowIndex, 1);
    map.unshift(newRow);
    return true;
  }
  return false;
}

export function removeFilledRow(map: number[][], box: Box): number;
export function removeFilledRow(map: number[][], rowNum: number): number;
export function removeFilledRow(map: number[][], param: unknown) {
  let removeRows = 0;
  if (typeof param === "number") {
    for (let i = 0; i < param; i++) {
      if (_removeFilledRow(map, map.length - i)) {
        removeRows++;
      }
    }
  } else {
    const box = param as Box;
    for (let i = 0; i < box.shape.length; i++) {
      const rowIndex = box.y + i;
      if (_removeFilledRow(map, rowIndex)) {
        removeRows++;
      }
    }
  }
  return removeRows;
}

export function checkGameOver(map: number[][]) {
  return map[0].some((item) => item === MapState.FILLED);
}

export function cleanMap(map: number[][]) {
  const length = map[0].length;
  for (let i = 0; i < map.length; i++) {
    map[i] = Array(length).fill(MapState.EMPTY);
  }
  return map;
}
