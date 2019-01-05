import produce, { applyPatches, Draft, Patch } from "immer";
import { ActionType, getType } from "typesafe-actions";
import * as coordinates from "../../lib/coordinates";
import { Command } from "../tool";
import { State } from "../types";
import * as actions from "./actions";
import { Tile, TilesState } from "./types";

const DEFAULT_STATE: TilesState = {
  data: {},
  transaction: [],
  past: [],
  future: [],
  updates: [],
  zLevel: 64,
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
  switch (action.type) {
    case getType(actions.undo):
      return changeHistory(state, "undo");
    case getType(actions.redo):
      return changeHistory(state, "redo");
  }
  let transactionSteps: Patch[];
  return produce(state, outerDraft => {
    switch (action.type) {
      case getType(actions.zLevelUp):
        if (outerDraft.zLevel < 128) {
          outerDraft.zLevel += 1;
        }
        break;
      case getType(actions.zLevelDown):
        if (outerDraft.zLevel > 0) {
          outerDraft.zLevel -= 1;
        }
        break;
    }

    outerDraft.data = produce(
      state.data,
      draft => {
        switch (action.type) {
          case getType(actions.updateTile): {
            const { x, y, command } = action.payload;
            const id = coordinates.toId(x, y);
            const newTile = addCommand(command, draft[id], id);
            if (newTile) {
              draft[id] = newTile;
            }
            break;
          }
          case getType(actions.fillTiles): {
            const { selection, command } = action.payload;
            coordinates.each(selection, ({ id }) => {
              const newTile = addCommand(command, draft[id], id);
              if (newTile) {
                draft[id] = newTile;
              }
            });
            break;
          }
          case getType(actions.removeTiles): {
            const { selection } = action.payload;
            coordinates.each(selection, ({ id }) => {
              if (state.data[id]) {
                delete draft[id];
              }
            });
            break;
          }
          case getType(actions.cloneTiles): {
            const { selection, toX, toY } = action.payload;
            coordinates.each(selection, ({ x, y, id: sourceId }) => {
              const destinationId = coordinates.toId(
                toX + (x - selection.startX),
                toY + (y - selection.startY),
              );
              if (state.data[sourceId]) {
                draft[destinationId] = {
                  ...state.data[sourceId],
                  id: destinationId,
                };
              } else if (draft[destinationId]) {
                delete draft[destinationId];
              }
            });
            break;
          }
          case getType(actions.moveTiles): {
            const { selection, toX, toY } = action.payload;
            coordinates.each(selection, ({ x, y, id: sourceId }) => {
              const destinationId = coordinates.toId(
                toX + (x - selection.startX),
                toY + (y - selection.startY),
              );
              const offset = {
                x: toX - selection.startX,
                y: toY - selection.startY,
              };
              if (
                !coordinates.within(coordinates.offset(selection, offset), {
                  x,
                  y,
                })
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
            });
            break;
          }
          case getType(actions.removeTile): {
            const { x, y, command } = action.payload;
            const id = coordinates.toId(x, y);
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
          case getType(actions.flipTiles): {
            const { selection, direction } = action.payload;
            coordinates.each(selection, ({ x, y, id: sourceId }) => {
              const destX =
                direction === "horizontal"
                  ? selection.endX - (x - selection.startX)
                  : x;
              const destY =
                direction === "vertical"
                  ? selection.endY - (y - selection.startY)
                  : y;
              const destinationId = coordinates.toId(destX, destY);
              if (state.data[sourceId]) {
                draft[destinationId] = {
                  ...state.data[sourceId],
                  id: destinationId,
                };
              } else if (draft[destinationId]) {
                delete draft[destinationId];
              }
            });
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
      action.type !== getType(actions.updateTile) &&
      action.type !== getType(actions.removeTile) &&
      outerDraft.transaction.length
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
  const id = coordinates.toId(x, y);
  return state.tiles.data[id];
};

export const selectLevelTiles = (state: State) => {
  return state.tiles.data;
};
