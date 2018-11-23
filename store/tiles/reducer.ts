import produce, { applyPatches, Patch } from "immer";
import { ActionType, getType } from "typesafe-actions";
import { State } from "../";
import * as actions from "./actions";
import { Tile, TilesState, TileStatus } from "./types";

const BOARD_HEIGHT = 40;
const BOARD_WIDTH = 80;

const INITIAL_STATE = {
  width: BOARD_WIDTH,
  height: BOARD_HEIGHT,
  selecting: false,
  dug: new Set(),
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
          const id = `${x},${y}`;
          const newSet = new Set(draft.dug);
          if (status === "dug") {
            newSet.add(id);
          } else {
            newSet.delete(id);
          }
          draft.dug = newSet;
          return;
        }
        case getType(actions.resetBoard): {
          return INITIAL_STATE;
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

export const selectStatus = (
  state: State,
  { x, y }: Pick<Tile, "x" | "y">,
): TileStatus => {
  const id = `${x},${y}`;
  return state.tiles.dug.has(id) ? "dug" : "undug";
};
