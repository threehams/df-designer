import produce, { applyPatches, Patch, DraftObject } from "immer";
import { ActionType, getType } from "typesafe-actions";
import { State } from "../types";
import * as actions from "./actions";
import { Tile, TilesState } from "./types";
import { range } from "../../lib/range";
import { Command, selectCommandMap } from "../tool";
import { idFromCoordinates } from "../../lib/coordinatesFromId";

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
  return produce(state, outerDraft => {
    const newData = produce(
      state.data,
      draft => {
        switch (action.type) {
          case getType(actions.updateTile): {
            const { x, y, command } = action.payload;
            const id = idFromCoordinates(x, y);
            draft[id] = addCommand(command, draft[id]);
            return;
          }
          case getType(actions.updateTiles): {
            const { startX, startY, endX, endY, command } = action.payload;
            for (const x of range(startX, endX + 1)) {
              for (const y of range(startY, endY + 1)) {
                const id = idFromCoordinates(x, y);
                draft[id] = addCommand(command, draft[id]);
              }
            }
            return;
          }
          case getType(actions.removeTile): {
            const { x, y, command } = action.payload;
            const id = idFromCoordinates(x, y);
            draft[id] = removeCommand(command, draft[id]);
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
    outerDraft.data = newData;
    outerDraft.patches = patches;
  });
};

const removeCommand = (
  command: Command,
  current: DraftObject<Tile> | null,
): Tile | null => {
  if (!current) {
    return null;
  }
  if (command.type === "designation") {
    return {
      designation: null,
      item: null,
      adjustments: null,
    };
  }
  current[command.type] = null;
  return current;
};

// Replace a command from the same phase, while keeping the rest.
const addCommand = (
  command: Command,
  current: DraftObject<Tile> | null,
): Tile => {
  if (!current) {
    return {
      designation: null,
      item: null,
      adjustments: null,
      [command.type]: command.command,
    };
  }
  current[command.type] = command.command;
  return current;
};

export const selectTile = (
  state: State,
  { x, y }: { x: number; y: number },
): Tile | null => {
  const id = idFromCoordinates(x, y);
  return state.tiles.data[id];
};
