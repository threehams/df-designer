import produce, { applyPatches, Patch } from "immer";
import { ActionType, getType } from "typesafe-actions";
import { State } from "../";
import * as actions from "./actions";
import { Tile, TilesState, TileStatus } from "./types";

const INITIAL_STATE: TilesState = {
  data: {},
  patches: [],
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
  state = INITIAL_STATE,
  action: ActionType<typeof actions>,
) => {
  if (action.type === getType(actions.undo)) {
    return state;
  }
  if (action.type === getType(actions.redo)) {
    return state;
  }
  if (action.type === getType(actions.resetBoard)) {
    return INITIAL_STATE;
  }
  let patches: Patch[];
  return produce(state, () => {
    const newData = produce(
      state.data,
      draft => {
        switch (action.type) {
          case getType(actions.updateTile): {
            const { x, y, status } = action.payload;
            const id = `${x},${y}`;
            draft[id] = [status];
            return;
          }
          case getType(actions.removeTile): {
            const { x, y } = action.payload;
            const id = `${x},${y}`;
            delete draft[id];
            return;
          }
        }
      },
      (newPatches, inversePatches) => {
        patches = newPatches;
        if (inversePatches.length) {
          history.transaction.push(...inversePatches);
        }
        applyPatches(state, newPatches);
      },
    );
    return {
      data: newData,
      patches,
    };
  });
};

export const selectStatus = (
  state: State,
  { x, y }: { x: number; y: number },
): Tile => {
  const id = `${x},${y}`;
  return state.tiles.data[id];
};
