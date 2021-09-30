import { addBoxToMap, removeFilledRow, MapState } from "../map";
import { Box } from "../box";

test("should add box to map", () => {
  const map = [
    [
      MapState.EMPTY,
      MapState.EMPTY,
      MapState.EMPTY,
      MapState.EMPTY,
      MapState.EMPTY,
    ],
    [
      MapState.EMPTY,
      MapState.EMPTY,
      MapState.EMPTY,
      MapState.EMPTY,
      MapState.EMPTY,
    ],
    [
      MapState.EMPTY,
      MapState.EMPTY,
      MapState.EMPTY,
      MapState.EMPTY,
      MapState.EMPTY,
    ],
    [
      MapState.EMPTY,
      MapState.EMPTY,
      MapState.EMPTY,
      MapState.EMPTY,
      MapState.EMPTY,
    ],
  ];
  const box = new Box();
  box.y = 1;
  box.shape = [
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
  ];

  addBoxToMap(map, box);
  expect([map[2][0], map[3][0], map[3][1], map[3][2]]).toEqual([
    MapState.FILLED,
    MapState.FILLED,
    MapState.FILLED,
    MapState.FILLED,
  ]);
});

test("should remove filled row", () => {
  const map = [
    [
      MapState.FILLED,
      MapState.EMPTY,
      MapState.EMPTY,
      MapState.EMPTY,
      MapState.EMPTY,
    ],
    [
      MapState.FILLED,
      MapState.FILLED,
      MapState.FILLED,
      MapState.FILLED,
      MapState.FILLED,
    ],
    [
      MapState.EMPTY,
      MapState.FILLED,
      MapState.EMPTY,
      MapState.EMPTY,
      MapState.FILLED,
    ],
    [
      MapState.FILLED,
      MapState.FILLED,
      MapState.FILLED,
      MapState.FILLED,
      MapState.FILLED,
    ],
    [
      MapState.EMPTY,
      MapState.FILLED,
      MapState.EMPTY,
      MapState.FILLED,
      MapState.FILLED,
    ],
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
    [
      MapState.EMPTY,
      MapState.EMPTY,
      MapState.EMPTY,
      MapState.EMPTY,
      MapState.EMPTY,
    ],
    [
      MapState.EMPTY,
      MapState.EMPTY,
      MapState.EMPTY,
      MapState.EMPTY,
      MapState.EMPTY,
    ],
    [
      MapState.FILLED,
      MapState.EMPTY,
      MapState.EMPTY,
      MapState.EMPTY,
      MapState.EMPTY,
    ],
    [
      MapState.EMPTY,
      MapState.FILLED,
      MapState.EMPTY,
      MapState.EMPTY,
      MapState.FILLED,
    ],
    [
      MapState.EMPTY,
      MapState.FILLED,
      MapState.EMPTY,
      MapState.FILLED,
      MapState.FILLED,
    ],
  ]);
});
