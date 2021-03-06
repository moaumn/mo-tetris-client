import { Coordinate } from "./box";
import { MapState } from "./map";

export function hitBottomBoundary(
  map: number[][],
  boxX: number,
  boxY: number,
  points: Coordinate[]
) {
  return points.some((point) => {
    const x = point.x + boxX;
    const y = point.y + boxY;
    return y + 1 > map.length - 1 || map[y + 1]?.[x] === MapState.FILLED;
  });
}

export function hitLeftBoundary(
  map: number[][],
  boxX: number,
  boxY: number,
  points: Coordinate[]
) {
  return points.some((point) => {
    const x = point.x + boxX;
    const y = point.y + boxY;
    return x <= 0 || map[y]?.[x - 1] === MapState.FILLED;
  });
}

export function hitRightBoundary(
  map: number[][],
  boxX: number,
  boxY: number,
  points: Coordinate[]
) {
  return points.some((point) => {
    const x = point.x + boxX;
    const y = point.y + boxY;
    return x + 1 > map[0].length - 1 || map[y]?.[x + 1] === MapState.FILLED;
  });
}
