import { boxType, createGame, moveDown, moveLeft } from "../index";
import { Box, MapState } from "../index";

describe("boundary", () => {
  test("moveDown", () => {
    const game = createGame({
      row: 5,
      col: 5,
      interval: 1000,
    });
    game.activeBox = new Box();
    game.activeBox.shape = boxType[2].shape;
    game.activeBox.computeBoundaryPoints();
    moveDown(game);
    expect(game.activeBox!.y).toEqual(1);
    moveDown(game);
    expect(game.activeBox!.y).toEqual(2);
  });

  test("moveLeft", () => {
    const leftLBox = new Box();
    leftLBox.shape = boxType[2].shape;
    leftLBox.x = 3;
    leftLBox.computeBoundaryPoints();
    const game = {
      map: [
        [
          MapState.EMPTY,
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
          MapState.EMPTY,
        ],
        [
          MapState.FILLED,
          MapState.FILLED,
          MapState.EMPTY,
          MapState.EMPTY,
          MapState.EMPTY,
          MapState.EMPTY,
        ],
        [
          MapState.FILLED,
          MapState.FILLED,
          MapState.EMPTY,
          MapState.EMPTY,
          MapState.EMPTY,
          MapState.EMPTY,
        ],
      ],
      activeBox: leftLBox,
    };
    moveLeft(game.map, game.activeBox);
    expect(game.activeBox.x).toEqual(2);
    moveLeft(game.map, game.activeBox);
    expect(game.activeBox.x).toEqual(2);
  });
});
