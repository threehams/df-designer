import produce, { applyPatches, Patch } from "immer";
import { ActionType, getType } from "typesafe-actions";
import { State } from "../";
import * as actions from "./actions";
import { Tile, TilesState } from "./types";
import { createSelector } from "reselect";
import { keys } from "../../lib/keys";

const INITIAL_STATE: TilesState = {
  data: {},
  patches: [],
  version: 0,
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
    return {
      ...INITIAL_STATE,
      version: state.version + 1,
    };
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
      ...state,
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

export const selectExported = createSelector(
  (state: State) => state.tiles.data,
  tiles => {
    const dimensions = Object.entries(tiles).reduce(
      (result, [id]) => {
        const { x, y } = getCoordinates(id);
        result.minX = x < result.minX ? x : result.minX;
        result.minY = y < result.minY ? y : result.minY;
        result.maxX = x + 1 > result.maxX ? x + 1 : result.maxX;
        result.maxY = y + 1 > result.maxY ? y + 1 : result.maxY;
        return result;
      },
      {
        minX: Infinity,
        maxX: 0,
        minY: Infinity,
        maxY: 0,
      },
    );
    if (dimensions.minX === Infinity || dimensions.minY === Infinity) {
      return null;
    }
    const grid = Array.from(
      Array(dimensions.maxY - dimensions.minY).keys(),
    ).map(() => {
      return Array(dimensions.maxX - dimensions.minX).fill("`");
    });
    for (const [id, status] of Object.entries(tiles)) {
      const { x, y } = getCoordinates(id);
      if (status.includes("dug")) {
        grid[y - dimensions.minY][x - dimensions.minX] = "d";
      }
    }
    return grid.map(x => x.join(",")).join("\n");
  },
);

const getCoordinates = (id: string) => {
  const [x, y] = id.split(",");
  return { x: parseInt(x), y: parseInt(y) };
};
