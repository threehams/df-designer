import produce, { applyPatches, Patch } from "immer";
import { ActionType, getType } from "typesafe-actions";
import { State } from "../";
import * as actions from "./actions";
import { Tile, TilesState } from "./types";
import { createSelector } from "reselect";
import { range } from "../../lib/range";
import { Command, selectCommandMap, selectPhases } from "../tool";
import {
  coordinatesFromId,
  idFromCoordinates,
} from "../../lib/coordinatesFromId";

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
            const newCommands = removeCommand(command, draft[id]);
            if (newCommands.length) {
              draft[id] = newCommands;
            } else {
              delete draft[id];
            }
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

const removeCommand = (command: Command, current: Command[] | null) => {
  if (!current) {
    return [];
  }
  const commandMap = selectCommandMap();
  const newPhase = commandMap[command].phase;
  return current.filter(currentCommand => {
    if (newPhase === "dig") {
      return false;
    }
    return commandMap[currentCommand].phase !== newPhase;
  });
};

// Replace a command from the same phase, while keeping the rest.
const addCommand = (command: Command, current: Command[] | null) => {
  if (!current) {
    return [command];
  }
  const commandMap = selectCommandMap();
  const newPhase = commandMap[command].phase;
  for (const [index, currentCommand] of current.entries()) {
    const currentPhase = commandMap[currentCommand].phase;
    if (newPhase === currentPhase) {
      const newCommands = current.slice();
      newCommands[index] = command;
      return newCommands;
    }
  }
  return [...current, command];
};

export const selectTile = (
  state: State,
  { x, y }: { x: number; y: number },
): Tile | null => {
  const id = idFromCoordinates(x, y);
  return state.tiles.data[id];
};

export const selectExported = createSelector(
  selectCommandMap,
  selectPhases,
  (state: State) => state.tiles.data,
  (commandMap, phases, tiles) => {
    const dimensions = Object.entries(tiles).reduce(
      (result, [id]) => {
        const { x, y } = coordinatesFromId(id);
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
    for (const phase of phases) {
      for (const [id, commands] of Object.entries(tiles)) {
        const { x, y } = coordinatesFromId(id);
        const command = commands.find(
          comm => commandMap[comm].phase === phase.phase,
        );
        if (command) {
          grid[y - dimensions.minY][x - dimensions.minX] =
            commandMap[command].shortcut;
        }
      }
    }
    return grid.map(x => x.join(",")).join("\n");
  },
);
