import produce, { applyPatches, Patch, Draft } from "immer";
import { ActionType, getType } from "typesafe-actions";
import { State } from "../types";
import * as actions from "./actions";
import { Tile, TilesState } from "./types";
import { range } from "../../lib/range";
import { Command } from "../tool";
import { idFromCoordinates } from "../../lib/coordinatesFromId";
import { withinCoordinates } from "../../lib/withinCoordinates";

const DEFAULT_STATE: TilesState = {
  data: {},
  transaction: [],
  past: [],
  future: [],
  updates: [],
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

const changeHistory = (state: TilesState, direction: "undo" | "redo") => {
  const from = direction === "undo" ? "past" : "future";
  const to = direction === "undo" ? "future" : "past";
  const transaction = state[from][state[from].length - 1];
  let redo: Patch[] = [];
  if (!transaction) {
    return state;
  }
  const newState = produce(state, draft => {
    draft[from].pop();
    applyPatches(state, transaction);
  });
  const newTiles = produce(
    state.data,
    draft => {
      return applyPatches(draft, transaction);
    },
    (_, inversePatches) => {
      redo = inversePatches;
    },
  );
  return {
    ...newState,
    [to]: state[to].concat([redo]),
    data: newTiles,
    updates: transaction.map(patch => patch.path[0] as string),
  };
};

const baseTilesReducer = (
  state: TilesState,
  action: ActionType<typeof actions>,
): TilesState => {
  if (action.type === getType(actions.undo)) {
    return changeHistory(state, "undo");
  }
  if (action.type === getType(actions.redo)) {
    return changeHistory(state, "redo");
  }
  let transactionSteps: Patch[];
  return produce(state, outerDraft => {
    outerDraft.data = produce(
      state.data,
      draft => {
        switch (action.type) {
          case getType(actions.updateTile): {
            const { x, y, command } = action.payload;
            const id = idFromCoordinates(x, y);
            const newTile = addCommand(command, draft[id], id);
            if (newTile) {
              draft[id] = newTile;
            }
            break;
          }
          case getType(actions.fillTiles): {
            const { startX, startY, endX, endY, command } = action.payload;
            for (const x of range(startX, endX + 1)) {
              for (const y of range(startY, endY + 1)) {
                const id = idFromCoordinates(x, y);
                const newTile = addCommand(command, draft[id], id);
                if (newTile) {
                  draft[id] = newTile;
                }
              }
            }
            break;
          }
          case getType(actions.cloneTiles): {
            const { startX, startY, endX, endY, toX, toY } = action.payload;
            for (const x of range(startX, endX + 1)) {
              for (const y of range(startY, endY + 1)) {
                const sourceId = idFromCoordinates(x, y);
                const destinationId = idFromCoordinates(
                  toX + (x - startX),
                  toY + (y - startY),
                );
                if (state.data[sourceId]) {
                  draft[destinationId] = {
                    ...state.data[sourceId],
                    id: destinationId,
                  };
                } else if (draft[destinationId]) {
                  delete draft[destinationId];
                }
              }
            }
            break;
          }
          case getType(actions.moveTiles): {
            const { startX, startY, endX, endY, toX, toY } = action.payload;
            for (const x of range(startX, endX + 1)) {
              for (const y of range(startY, endY + 1)) {
                const sourceId = idFromCoordinates(x, y);
                const destinationId = idFromCoordinates(
                  toX + (x - startX),
                  toY + (y - startY),
                );
                const offsetX = toX - startX;
                const offsetY = toY - startY;
                if (
                  !withinCoordinates(
                    { x: startX + offsetX, y: startY + offsetY },
                    { x: endX + offsetX, y: endY + offsetY },
                    { x, y },
                  )
                ) {
                  delete draft[sourceId];
                }
                if (state.data[sourceId]) {
                  draft[destinationId] = {
                    ...state.data[sourceId],
                    id: destinationId,
                  };
                } else if (draft[destinationId]) {
                  delete draft[destinationId];
                }
              }
            }
            break;
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
            break;
          }
          case getType(actions.setAdjustment): {
            const { id, name, value } = action.payload;
            draft[id].adjustments[name] = value;
            break;
          }
          case getType(actions.flip): {
            const { startX, startY, endX, endY, direction } = action.payload;
            for (const x of range(startX, endX + 1)) {
              for (const y of range(startY, endY + 1)) {
                const sourceId = idFromCoordinates(x, y);
                const destX =
                  direction === "horizontal" ? endX - (x - startX) : x;
                const destY =
                  direction === "vertical" ? endY - (y - startY) : y;
                const destinationId = idFromCoordinates(destX, destY);
                if (state.data[sourceId]) {
                  draft[destinationId] = {
                    ...state.data[sourceId],
                    id: destinationId,
                  };
                } else if (draft[destinationId]) {
                  delete draft[destinationId];
                }
              }
            }
            break;
          }
          case getType(actions.resetBoard): {
            for (const id of Object.keys(draft)) {
              delete draft[id];
            }
            break;
          }
        }
      },
      (patches, inversePatches) => {
        outerDraft.updates = patches.map(patch => patch.path[0] as string);
        transactionSteps = inversePatches;
        if (transactionSteps.length) {
          history.transaction.push(...inversePatches);
        }
      },
    );
    if (transactionSteps && transactionSteps.length) {
      // possible improvement: https://medium.com/@dedels/using-immer-to-compress-immer-patches-f382835b6c69
      outerDraft.transaction = [...outerDraft.transaction, ...transactionSteps];
      // any transactions invalidate the future
      outerDraft.future = [];
    }
    if (
      action.type === getType(actions.fillTiles) ||
      action.type === getType(actions.endUpdate) ||
      action.type === getType(actions.resetBoard) ||
      action.type === getType(actions.cloneTiles) ||
      action.type === getType(actions.moveTiles) ||
      action.type === getType(actions.flip)
    ) {
      if (outerDraft.transaction.length) {
        outerDraft.past.push(outerDraft.transaction);
        outerDraft.transaction = [];
      }
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
  current: Draft<Tile> | null,
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
  current: Draft<Tile> | null,
  id: string,
): Tile | null => {
  if (command.type !== "designation" && (!current || !current.designation)) {
    return null;
  }
  if (!current) {
    return {
      id,
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
