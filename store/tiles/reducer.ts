import produce, { applyPatches, Patch } from "immer";
import { flatMap, range } from "lodash";
import { ActionType, getType } from "typesafe-actions";
import { State } from "../";
import * as actions from "./actions";
import { Tile, TilesState } from "./types";

const BOARD_HEIGHT = 80;
const BOARD_WIDTH = 80;

const initialTiles = (width: number, height: number) => {
  return flatMap(range(0, height), x => {
    return range(0, width).map(y => [x, y]);
  }).reduce((result: TilesState["data"], [x, y]) => {
    result[`${x},${y}`] = {
      x,
      y,
      status: "undug",
    };
    return result;
  }, {});
};

const INITIAL_STATE = {
  width: BOARD_HEIGHT,
  height: BOARD_HEIGHT,
  data: initialTiles(BOARD_WIDTH, BOARD_HEIGHT),
  selecting: false,
};

interface History {
  transaction: Patch[];
  past: Patch[][];
  future: Patch[][];
}
const history: History = {
  transaction: [],
  past: [],
  future: [],
};

export const tilesReducer = (
  state: TilesState = INITIAL_STATE,
  action: ActionType<typeof actions>,
) => {
  if (action.type === getType(actions.undo)) {
    return state;
  }
  if (action.type === getType(actions.redo)) {
    return state;
  }
  return produce(
    state,
    draft => {
      switch (action.type) {
        case getType(actions.updateTile): {
          const { x, y, status } = action.payload;
          draft.data[`${x},${y}`].status = status;
          return;
        }
        case getType(actions.resetBoard): {
          draft.data = initialTiles(state.width, state.height);
          return;
        }
        case getType(actions.startSelection): {
          draft.selecting = true;
          return;
        }
      }
    },
    (patches, inversePatches) => {
      if (inversePatches.length) {
        history.transaction.push(...inversePatches);
      }
      applyPatches(state, patches);
    },
  );
};

export const selectTile = (state: State, { x, y }: Pick<Tile, "x" | "y">) => {
  return state.tiles.data[`${x},${y}`];
};
