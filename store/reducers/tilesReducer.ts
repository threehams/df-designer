import produce, { applyPatches, Draft, Patch } from "immer";
import { range } from "lodash";
import { ActionType, getType } from "typesafe-actions";
import * as coordinates from "../../lib/coordinates";
import { tilesActions } from "../actions";
import { Command, State, Tile, TilesMap, TilesState, ZPatch } from "../types";

export const INITIAL_STATE: TilesState = {
  data: range(0, 128).reduce(
    (result, zIndex) => {
      result[zIndex] = {};
      return result;
    },
    {} as Draft<State["tiles"]["data"]>,
  ),
  transaction: [],
  past: [],
  future: [],
  updates: [],
  zLevel: 64,
};

const changeHistory = (state: TilesState, direction: "undo" | "redo") => {
  const from = direction === "undo" ? "past" : "future";
  const to = direction === "undo" ? "future" : "past";
  const transaction = state[from][state[from].length - 1];
  if (!transaction) {
    return state;
  }

  let redo = {};
  const newTiles = produce(
    state.data[transaction.zLevel],
    draft => {
      return applyPatches(draft, transaction.patches);
    },
    (_, inversePatches) => {
      redo = {
        zLevel: transaction.zLevel,
        patches: inversePatches,
      };
    },
  );
  return {
    ...state,
    [to]: state[to].concat([redo as ZPatch]),
    [from]: state[from].slice(0, state[from].length - 1),
    data: {
      ...state.data,
      [transaction.zLevel]: newTiles,
    },
    updates: transaction.patches.map(patch => {
      return {
        id: patch.path[0] as string,
        zLevel: transaction.zLevel,
      };
    }),
  };
};

export const tilesReducer = (
  state: TilesState = INITIAL_STATE,
  action: ActionType<typeof tilesActions>,
): TilesState => {
  switch (action.type) {
    case getType(tilesActions.undo):
      return changeHistory(state, "undo");
    case getType(tilesActions.redo):
      return changeHistory(state, "redo");
    case getType(tilesActions.setTilesState): {
      return {
        ...state,
        data: action.payload.tiles,
      };
    }
  }
  let transactionSteps: Patch[];
  return produce(state, outerDraft => {
    switch (action.type) {
      case getType(tilesActions.zLevelUp):
        if (outerDraft.zLevel < 128) {
          outerDraft.zLevel += 1;
        }
        break;
      case getType(tilesActions.zLevelDown):
        if (outerDraft.zLevel > 0) {
          outerDraft.zLevel -= 1;
        }
        break;
    }

    outerDraft.data[state.zLevel] = produce(
      state.data[state.zLevel],
      draft => {
        const currentTiles = state.data[state.zLevel];
        switch (action.type) {
          case getType(tilesActions.updateTile): {
            const { x, y, command } = action.payload;
            const id = coordinates.toId(x, y);
            const newTile = addCommand(command, draft[chunkForId(id)][id], id);
            if (newTile) {
              draft[chunkForId(id)][id] = newTile;
            }
            break;
          }
          case getType(tilesActions.fillTiles): {
            const { selection, command } = action.payload;
            coordinates.each(selection, ({ id }) => {
              const newTile = addCommand(
                command,
                draft[chunkForId(id)][id],
                id,
              );
              if (newTile) {
                draft[chunkForId(id)][id] = newTile;
              }
            });
            break;
          }
          case getType(tilesActions.removeTiles): {
            const { selection } = action.payload;
            coordinates.each(selection, ({ id }) => {
              if (currentTiles[id]) {
                delete draft[chunkForId(id)][id];
              }
            });
            break;
          }
          case getType(tilesActions.cloneTiles): {
            const { selection, toX, toY } = action.payload;
            coordinates.each(selection, ({ x, y, id: sourceId }) => {
              const destinationId = coordinates.toId(
                toX + (x - selection.startX),
                toY + (y - selection.startY),
              );
              if (currentTiles[chunkForId(sourceId)][sourceId]) {
                draft[chunkForId(destinationId)][destinationId] = {
                  ...currentTiles[chunkForId(sourceId)][sourceId],
                  id: destinationId,
                  coordinates: coordinates.fromId(destinationId),
                };
              } else if (draft[chunkForId(destinationId)][destinationId]) {
                delete draft[chunkForId(destinationId)][destinationId];
              }
            });
            break;
          }
          case getType(tilesActions.moveTiles): {
            const { selection, toX, toY } = action.payload;
            coordinates.each(selection, ({ x, y, id: sourceId }) => {
              const destinationId = coordinates.toId(
                toX + (x - selection.startX),
                toY + (y - selection.startY),
              );
              if (
                !coordinates.within(
                  coordinates.offset(selection, {
                    x: toX - selection.startX,
                    y: toY - selection.startY,
                  }),
                  { x, y },
                )
              ) {
                delete draft[sourceId];
              }
              if (currentTiles[chunkForId(sourceId)][sourceId]) {
                draft[chunkForId(destinationId)][destinationId] = {
                  ...currentTiles[chunkForId(sourceId)][sourceId],
                  id: destinationId,
                  coordinates: coordinates.fromId(destinationId),
                };
              } else if (draft[chunkForId(destinationId)][destinationId]) {
                delete draft[chunkForId(destinationId)][destinationId];
              }
            });
            break;
          }
          case getType(tilesActions.flipTiles): {
            const { selection, direction } = action.payload;
            coordinates.each(selection, ({ x, y, id: sourceId }) => {
              const toX =
                direction === "horizontal"
                  ? selection.endX - (x - selection.startX)
                  : x;
              const toY =
                direction === "vertical"
                  ? selection.endY - (y - selection.startY)
                  : y;
              const destinationId = coordinates.toId(toX, toY);
              if (currentTiles[chunkForId(sourceId)][sourceId]) {
                draft[chunkForId(destinationId)][destinationId] = {
                  ...currentTiles[chunkForId(sourceId)][sourceId],
                  id: destinationId,
                  coordinates: coordinates.fromId(destinationId),
                };
              } else if (draft[chunkForId(destinationId)][destinationId]) {
                delete draft[chunkForId(destinationId)][destinationId];
              }
            });
            break;
          }
          case getType(tilesActions.removeTile): {
            const { x, y, command } = action.payload;
            const id = coordinates.toId(x, y);
            const newTile = removeCommand(command, draft[chunkForId(id)][id]);
            if (newTile) {
              draft[chunkForId(id)][id] = newTile;
            } else {
              delete draft[chunkForId(id)][id];
            }
            break;
          }
          case getType(tilesActions.setAdjustment): {
            const { id, name, value } = action.payload;
            draft[chunkForId(id)][id].adjustments[name] = value;
            break;
          }
          case getType(tilesActions.importAll): {
            deleteAll(draft);
            action.payload.imports.forEach(tile => {
              draft[chunkForId(tile.id)][tile.id] = tile;
            });
            break;
          }
          case getType(tilesActions.resetBoard): {
            deleteAll(draft);
            break;
          }
        }
      },
      (patches, inversePatches) => {
        outerDraft.updates = patches.map(patch => {
          return {
            id: patch.path[0] as string,
            zLevel: outerDraft.zLevel,
          };
        });
        transactionSteps = inversePatches;
        if (transactionSteps.length) {
          outerDraft.transaction.push(...inversePatches);
        }
      },
    );
    if (transactionSteps && transactionSteps.length) {
      // possible improvement: https://medium.com/@dedels/using-immer-to-compress-immer-patches-f382835b6c69
      outerDraft.transaction = [...outerDraft.transaction, ...transactionSteps];
      // any transtilesActions invalidate the future
      outerDraft.future = [];
    }
    if (
      action.type !== getType(tilesActions.updateTile) &&
      action.type !== getType(tilesActions.removeTile) &&
      outerDraft.transaction.length
    ) {
      outerDraft.past.push({
        zLevel: outerDraft.zLevel,
        patches: outerDraft.transaction,
      });
      outerDraft.transaction = [];
    }
  });
};

const deleteAll = (draft: Draft<{ [chunkId: string]: TilesMap }>) => {
  for (const id of Object.keys(draft)) {
    delete draft[chunkForId(id)][id];
  }
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
      coordinates: coordinates.fromId(id),
      designation: null,
      item: null,
      adjustments: {},
      [command.type]: command.slug,
    };
  }
  current[command.type] = command.slug;
  return current;
};

const chunkForId = (id: string): string => {
  const { x, y } = coordinates.coordinatesFromId(id);
  return coordinates.idFromCoordinates(Math.floor(x / 10), Math.floor(y / 10));
};

export const selectTile = (
  state: State,
  { x, y }: { x: number; y: number },
): Tile | null => {
  const id = coordinates.toId(x, y);
  return state.tiles.data[state.tiles.zLevel][chunkForId(id)][id];
};

export const selectLevelTiles = (
  state: Pick<State, "tiles">,
  props: { zLevel: number },
) => {
  return state.tiles.data[props.zLevel];
};
