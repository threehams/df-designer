import produce, { applyPatches, Patch, DraftObject } from "immer";
import { ActionType, getType } from "typesafe-actions";
import { State } from "../types";
import * as actions from "./actions";
import { Tile, TilesState } from "./types";
import { range } from "../../lib/range";
import { Command } from "../tool";
import { idFromCoordinates } from "../../lib/coordinatesFromId";

const DEFAULT_STATE: TilesState = {
  data: {},
  transaction: [],
  past: [],
  future: [],
};

// be as defensive as possible here
const initialState = (): TilesState => {
  if (typeof localStorage === "undefined") {
    return DEFAULT_STATE;
  }
  const json = localStorage.getItem("df-designer-state");
  if (!json) {
    return DEFAULT_STATE;
  }
  try {
    const tiles = JSON.parse(json);
    if (tiles) {
      return produce(DEFAULT_STATE, draft => {
        draft.data = tiles;
      });
    }
  } catch (err) {
    // tslint:disable-next-line no-console
    console.log(err);
  }
  return DEFAULT_STATE;
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

const baseTilesReducer = (
  state: TilesState,
  action: ActionType<typeof actions>,
) => {
  if (action.type === getType(actions.undo)) {
    const transaction = state.past[state.past.length - 1];
    if (!transaction) {
      return state;
    }
    const newState = produce(state, outerDraft => {
      outerDraft.past.pop();
      applyPatches(state, transaction);
    });
    return {
      ...newState,
      data: applyPatches(state.data, transaction),
    };
  }
  if (action.type === getType(actions.redo)) {
    return state;
  }
  // this is wrong, don't reset undo history, allow reset to be undone
  if (action.type === getType(actions.resetBoard)) {
    return DEFAULT_STATE;
  }
  let transactionSteps: Patch[];
  return produce(state, outerDraft => {
    const newData = produce(
      state.data,
      draft => {
        switch (action.type) {
          case getType(actions.updateTile): {
            const { x, y, command } = action.payload;
            const id = idFromCoordinates(x, y);
            const newTile = addCommand(command, draft[id]);
            if (newTile) {
              draft[id] = newTile;
            }
            return;
          }
          case getType(actions.updateTiles): {
            const { startX, startY, endX, endY, command } = action.payload;
            for (const x of range(startX, endX + 1)) {
              for (const y of range(startY, endY + 1)) {
                const id = idFromCoordinates(x, y);
                const newTile = addCommand(command, draft[id]);
                if (newTile) {
                  draft[id] = newTile;
                }
              }
            }
            return;
          }
          case getType(actions.removeTile): {
            const { x, y, command } = action.payload;
            const id = idFromCoordinates(x, y);
            const newTile = removeCommand(command, draft[id]);
            if (newTile) {
              draft[id] = newTile;
            } else {
              delete draft[id];
            }
            return;
          }
          case getType(actions.setAdjustment): {
            const { id, name, value } = action.payload;
            draft[id].adjustments[name] = value;
            return;
          }
        }
      },
      (patches, inversePatches) => {
        transactionSteps = inversePatches;
        if (transactionSteps.length) {
          history.transaction.push(...inversePatches);
        }
      },
    );
    outerDraft.data = newData;
    if (transactionSteps && transactionSteps.length) {
      // possible improvement: https://medium.com/@dedels/using-immer-to-compress-immer-patches-f382835b6c69
      outerDraft.transaction = [...outerDraft.transaction, ...transactionSteps];
    }
    if (
      action.type === getType(actions.updateTiles) ||
      action.type === getType(actions.endUpdate)
    ) {
      outerDraft.past.push(outerDraft.transaction);
      outerDraft.transaction = [];
    }
  });
};

export const tilesReducer = (
  state = initialState(),
  action: ActionType<typeof actions>,
) => {
  const newState = baseTilesReducer(state, action);
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("df-designer-state", JSON.stringify(newState.data));
  }
  return newState;
};

const removeCommand = (
  command: Command,
  current: DraftObject<Tile> | null,
): Tile | null => {
  if (!current || command.type === "designation") {
    return null;
  }
  current[command.type] = null;
  return current;
};

// Replace a command from the same phase, while keeping the rest.
const addCommand = (
  command: Command,
  current: DraftObject<Tile> | null,
): Tile | null => {
  if (command.type !== "designation" && (!current || !current.designation)) {
    return null;
  }
  if (!current) {
    return {
      designation: null,
      item: null,
      adjustments: {},
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
