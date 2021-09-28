import { addBoxToMap, removeFilledRow } from "../map";
import { Box } from "../box";

test("should add box to map", () => {
  const map = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ];
  const box = new Box();
  box.y = 1;
  box.shape = [
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
  ];

  addBoxToMap(map, box);
  expect([map[2][0], map[3][0], map[3][1], map[3][2]]).toEqual([2, 2, 2, 2]);
});

test("should remove filled row", () => {
  const map = [
    [2, 0, 0, 0, 0],
    [2, 2, 2, 2, 2],
    [0, 2, 0, 0, 2],
    [2, 2, 2, 2, 2],
    [0, 2, 0, 2, 2],
  ];
  const box = new Box();
  box.shape = [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ];
  box.x = 3;
  box.y = 1;
  removeFilledRow(map, box);
  expect(map).toEqual([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [2, 0, 0, 0, 0],
    [0, 2, 0, 0, 2],
    [0, 2, 0, 2, 2],
  ]);
});
