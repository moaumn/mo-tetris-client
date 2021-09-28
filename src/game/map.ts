import { Box } from "./box";

export function initMap(row: number, col: number) {
  const map = Array(row);
  for (let i = 0; i < map.length; i++) {
    map[i] = Array(col).fill(0);
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
          map[y][x] = 2;
        }
      }
    }
  }
}

export function removeFilledRow(map: number[][], box: Box) {
  let rows = 0;
  for (let i = 0; i < box.shape.length; i++) {
    const y = box.y + i;
    if (map[y] && map[y].every((item) => item === 2)) {
      rows++;
      const newRow = Array(map[y].length).fill(0);
      map.splice(y, 1);
      map.unshift(newRow);
    }
  }
  return rows;
}

export function checkGameOver(map: number[][]) {
  return map[0].some((item) => item === 2);
}

export function cleanMap(map: number[][]) {
  const length = map[0].length;
  for (let i = 0; i < map.length; i++) {
    map[i] = Array(length).fill(0);
  }
  return map;
}
