import {
  getBottomPoints,
  getLeftPoints,
  getRightPoints,
  rotate90,
  rotate180,
  rotate270,
  Box,
} from "../box";

test("should return bottom points", () => {
  const matrix1 = [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ];
  expect(getBottomPoints(matrix1)).toEqual([
    {
      x: 1,
      y: 3,
    },
  ]);

  const matrix2 = [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
  ];
  expect(getBottomPoints(matrix2)).toEqual([
    {
      x: 0,
      y: 1,
    },
    {
      x: 1,
      y: 2,
    },
    {
      x: 2,
      y: 2,
    },
  ]);

  const matrix3 = [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0],
  ];
  expect(getBottomPoints(matrix3)).toEqual([
    {
      x: 0,
      y: 0,
    },
    {
      x: 1,
      y: 1,
    },
    {
      x: 2,
      y: 0,
    },
  ]);
});

test("should return left points", () => {
  const matrix = [
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
  ];
  expect(getLeftPoints(matrix)).toEqual([
    {
      x: 0,
      y: 1,
    },
    {
      x: 0,
      y: 2,
    },
  ]);

  const matrix1 = [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
  ];
  expect(getLeftPoints(matrix1)).toEqual([
    {
      x: 0,
      y: 1,
    },
    {
      x: 1,
      y: 2,
    },
  ]);

  const matrix3 = [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0],
  ];
  expect(getLeftPoints(matrix3)).toEqual([
    {
      x: 0,
      y: 0,
    },
    {
      x: 1,
      y: 1,
    },
  ]);
});

test("should return right points", () => {
  const matrix = [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
  ];
  expect(getRightPoints(matrix)).toEqual([
    {
      x: 1,
      y: 1,
    },
    {
      x: 2,
      y: 2,
    },
  ]);

  const matrix1 = [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0],
  ];
  expect(getRightPoints(matrix1)).toEqual([
    {
      x: 2,
      y: 0,
    },
    {
      x: 1,
      y: 1,
    },
  ]);
});

describe("should rotate matrix", () => {
  test("rotate90", () => {
    const matrix = [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ];
    expect(rotate90(matrix)).toEqual([
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0],
    ]);
  });

  test("rotate180", () => {
    const matrix = [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ];
    expect(rotate180(matrix)).toEqual([
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1],
    ]);
    // m[0][0] = m[2][2]
    // m[0][1] = m[2][1]
    // m[0][2] = m[2][0]
  });
  test("270deg", () => {
    const matrix = [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ];
    expect(rotate270(matrix)).toEqual([
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0],
    ]);
    // m[0][0] = m[0][2]
    // m[0][1] = m[1][2]
    // m[0][2] = m[2][2]
  });
});

describe("should rotate box", () => {
  function createBox() {
    const box = new Box();
    box.setRotateStrategy([rotate90, rotate90, rotate90, rotate90]);
    return box;
  }

  test("can rotate", () => {
    const map = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [2, 2, 0, 0, 0, 0],
      [2, 2, 0, 0, 0, 0],
    ];
    const box = createBox();
    box.shape = [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ];
    box.x = 0;
    box.y = 0;
    box.rotate(map);
    expect(box.shape).toEqual([
      [1, 1, 0],
      [1, 0, 0],
      [1, 0, 0],
    ]);
    expect(box.x).toEqual(0);
    expect(box.y).toEqual(0);
  });

  test("can rotate but need to move right", () => {
    const map = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [2, 2, 0, 0, 0, 0],
      [2, 2, 0, 0, 0, 0],
    ];
    const box = createBox();
    box.shape = [
      [0, 0, 1],
      [0, 0, 1],
      [0, 1, 1],
    ];
    box.x = -1;
    box.y = 0;
    box.rotate(map);
    expect(box.shape).toEqual([
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ]);
    expect(box.x).toEqual(0);
    expect(box.y).toEqual(0);
  });

  test("can rotate but need to move left", () => {
    const map = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 0, 0],
      [0, 0, 0, 2, 0, 0],
    ];
    const box = createBox();
    box.shape = [
      [1, 1, 0],
      [1, 0, 0],
      [1, 0, 0],
    ];
    box.x = 4;
    box.y = 2;
    box.rotate(map);
    expect(box.shape).toEqual([
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 0],
    ]);
    expect(box.x).toEqual(3);
    expect(box.y).toEqual(2);
  });

  test("no enough space on the left to rotate", () => {
    const map = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 2, 2, 0, 0],
      [0, 0, 2, 2, 0, 0],
      [0, 0, 2, 2, 0, 0],
    ];
    const box = createBox();
    box.shape = [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ];
    box.x = -1;
    box.y = 1;
    box.rotate(map);
    expect(box.shape).toEqual([
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ]);
    expect(box.x).toEqual(-1);
    expect(box.y).toEqual(1);
  });

  test("no enough space on the right to rotate", () => {
    const map = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 2, 2, 0, 0],
      [0, 0, 2, 2, 0, 0],
      [0, 0, 2, 2, 0, 0],
    ];
    const box = createBox();
    box.shape = [
      [1, 1, 0],
      [1, 0, 0],
      [1, 0, 0],
    ];
    box.x = 4;
    box.y = 3;
    box.rotate(map);
    expect(box.shape).toEqual([
      [1, 1, 0],
      [1, 0, 0],
      [1, 0, 0],
    ]);
    expect(box.x).toEqual(4);
    expect(box.y).toEqual(3);
  });

  test("no enough space on the bottom to rotate", () => {
    const map = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ];
    const box = createBox();
    box.shape = [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    box.x = 0;
    box.y = 3;
    box.rotate(map);
    expect(box.shape).toEqual([
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    expect(box.x).toEqual(0);
    expect(box.y).toEqual(3);
  });
});
