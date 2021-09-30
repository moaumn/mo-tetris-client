import { hitBottomBoundary, hitLeftBoundary, hitRightBoundary } from "./hit";

export type Coordinate = {
  x: number;
  y: number;
};

export class Box {
  x: number = 0;
  y: number = 0;
  shape: number[][] = [[]];
  typeIndex: number = 0;
  directionIndex: number = 0;
  canRotate: boolean = true;

  // 旋转
  _rotateStrategy: Function[] = [];
  _rotateIndex = 0;
  setRotateStrategy(rotateStrategy: Function[]) {
    this._rotateStrategy = rotateStrategy;
  }
  rotate(map: number[][]) {
    if (!this.canRotate || this._rotateStrategy.length === 0) return;
    if (this._rotateIndex > this._rotateStrategy.length - 1) {
      this._rotateIndex = 0;
    }
    const strategy = this._rotateStrategy[this._rotateIndex];
    const newShape = strategy(this.shape);
    // 对旋转结果进行碰撞检测
    // 1.检测旋转后下方空间，不足则不移动。
    const bottomPoints = getBottomPoints(newShape);
    if (hitBottomBoundary(map, this.x, this.y - 1, bottomPoints)) {
      return;
    }
    // 2.检测左侧碰撞，右移直到无碰撞，然后检测右侧碰撞，如有碰撞则证明无旋转空间，不允许旋转
    const leftPoints = getLeftPoints(newShape);
    const rightPoints = getRightPoints(newShape);
    let x = this.x + 1;
    if (hitLeftBoundary(map, x, this.y, leftPoints)) {
      do {
        x++;
      } while (hitLeftBoundary(map, x, this.y, leftPoints));
      if (hitRightBoundary(map, x - 2, this.y, rightPoints)) {
        return;
      }
      this.x = x - 1;
    }
    // 3.检侧右侧碰撞，流程同上
    x = this.x - 1;
    if (hitRightBoundary(map, x, this.y, rightPoints)) {
      do {
        x--;
      } while (hitRightBoundary(map, x, this.y, leftPoints));
      if (hitLeftBoundary(map, x + 2, this.y, leftPoints)) {
        return;
      }
      this.x = x + 1;
    }
    // 可以旋转，修改数据
    this.shape = newShape;
    this._rotateIndex++;
    this.leftPoints = leftPoints;
    this.rightPoints = rightPoints;
    this.bottomPoints = bottomPoints;
  }

  // 边界点
  leftPoints: Coordinate[] = [];
  rightPoints: Coordinate[] = [];
  bottomPoints: Coordinate[] = [];
  computeBoundaryPoints() {
    this.leftPoints = getLeftPoints(this.shape);
    this.rightPoints = getRightPoints(this.shape);
    this.bottomPoints = getBottomPoints(this.shape);
  }
}

export const boxType = [
  {
    shape: [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
    rotateStrategy: [rotate90, rotate270],
  },
  {
    shape: [
      [1, 1, 1],
      [0, 1, 0],
      [0, 0, 0],
    ],
    rotateStrategy: [rotate90, rotate90, rotate90, rotate90],
  },
  {
    shape: [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ],
    rotateStrategy: [rotate90, rotate90, rotate90, rotate90],
  },
  {
    shape: [
      [0, 0, 0],
      [0, 0, 1],
      [1, 1, 1],
    ],
    rotateStrategy: [rotate90, rotate90, rotate90, rotate90],
  },
  {
    shape: [
      [1, 1],
      [1, 1],
    ],
    rotateStrategy: [],
  },
  {
    shape: [
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1],
    ],
    rotateStrategy: [rotate90, rotate270],
  },
  {
    shape: [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0],
    ],
    rotateStrategy: [rotate90, rotate270],
  },
];

export function createRandomBox(
  destineType?: number,
  destineDirection?: number
) {
  const box = new Box();
  const typeIndex = destineType ?? Math.trunc(Math.random() * 7);
  const type = boxType[typeIndex];
  const directionIndex = destineDirection ?? Math.trunc(Math.random() * 4);
  const directionStrategy = [
    rotate90,
    rotate180,
    rotate270,
    (matrix: number[][]) => JSON.parse(JSON.stringify(matrix)),
  ];
  box.shape = directionStrategy[directionIndex](type.shape);
  box.typeIndex = typeIndex;
  box.directionIndex = directionIndex;
  box.setRotateStrategy(type.rotateStrategy);
  box.computeBoundaryPoints();
  return box;
}

export function getBottomPoints(matrix: number[][]) {
  const points = Array(matrix[0].length);
  for (let i = 0; i < points.length; i++) {
    for (let j = matrix.length - 1; j >= 0; j--) {
      if (matrix[j][i] === 1) {
        points[i] = { x: i, y: j };
        break;
      }
    }
  }
  return points.filter((value) => value);
}

export function getRightPoints(matrix: number[][]) {
  const points = Array(matrix.length);
  for (let i = 0; i < points.length; i++) {
    for (let j = matrix[0].length - 1; j >= 0; j--) {
      if (matrix[i][j] === 1) {
        points[i] = { x: j, y: i };
        break;
      }
    }
  }
  return points.filter((value) => value);
}

export function getLeftPoints(matrix: number[][]) {
  const points = Array(matrix.length);
  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      if (matrix[i][j] === 1) {
        points[i] = { x: j, y: i };
        break;
      }
    }
  }
  return points.filter((value) => value);
}

// 原列 = 新行   原行 = 新列倒序
export function rotate90(matrix: number[][]) {
  const newMatrix: number[][] = [];
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      const col = matrix[0].length - j - 1;
      if (!newMatrix[i]) newMatrix[i] = [];
      newMatrix[i][j] = matrix[col][i];
    }
  }
  return newMatrix;
}

// 原行 = 新行倒序   原列 = 新列倒序
export function rotate180(matrix: number[][]) {
  const newMatrix: number[][] = [];
  const rowLength = matrix.length;
  const colLength = matrix[0].length;
  for (let i = 0; i < rowLength; i++) {
    for (let j = 0; j < colLength; j++) {
      const row = rowLength - i - 1;
      const col = colLength - j - 1;
      if (!newMatrix[i]) newMatrix[i] = [];
      newMatrix[i][j] = matrix[row][col];
    }
  }
  return newMatrix;
}

// 原行 = 新列   原列 = 新行倒序
export function rotate270(matrix: number[][]) {
  const newMatrix: number[][] = [];
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      const row = matrix[0].length - i - 1;
      if (!newMatrix[i]) newMatrix[i] = [];
      newMatrix[i][j] = matrix[j][row];
    }
  }
  return newMatrix;
}
