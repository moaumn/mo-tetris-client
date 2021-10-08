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

function _removeFilledRow(map: number[][], start: number, end: number) {
  const filledRows = [];
  const colLength = map[0].length;
  for (let i = end; i >= start; i--) {
    if (map[i] && map[i].every((item) => item === MapState.FILLED)) {
      filledRows.push(i);
    }
  }
  filledRows.forEach((item) => map.splice(item, 1));
  for (let i = 0; i < filledRows.length; i++) {
    const newRow = Array(colLength).fill(MapState.EMPTY);
    map.unshift(newRow);
  }
  return filledRows.length;
}

export function removeFilledRow(map: number[][], box: Box): number;
export function removeFilledRow(map: number[][], rowNum: number): number;
export function removeFilledRow(map: number[][], param: unknown) {
  if (typeof param === "number") {
    return _removeFilledRow(map, map.length - param, map.length - 1);
  } else if (param instanceof Box) {
    return _removeFilledRow(map, param.y, param.y + param.shape.length - 1);
  }
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
