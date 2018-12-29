import { Dispatch } from "redux";
import { createAction } from "typesafe-actions";
import { State } from "../types";
import { selectTool, selectCurrentCommand } from "../tool";
import { selectTile } from "./reducer";
import { Command, Coordinates } from "../tool/types";
import { toolActions } from "../tool";
import { Tile } from "./types";

export const updateTile = createAction("app/tiles/UPDATE_TILE", resolve => {
  return (x: number, y: number, command: Command) => {
    return resolve({ x, y, command });
  };
});
export const setAdjustment = createAction(
  "app/tiles/SET_ADJUSTMENT",
  resolve => {
    return (id: string, name: string, value: any) => {
      return resolve({ id, name, value });
    };
  },
);
export const updateTiles = createAction("app/tiles/UPDATE_TILES", resolve => {
  return (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    command: Command,
  ) => {
    return resolve({ startX, startY, endX, endY, command });
  };
});
export const removeTile = createAction("app/tiles/REMOVE_TILE", resolve => {
  return (x: number, y: number, command: Command) => resolve({ x, y, command });
});
export const resetBoard = createAction("app/tiles/RESET_BOARD");
export const undo = createAction("app/tiles/UNDO");
export const redo = createAction("app/tiles/REDO");
export const endUpdate = createAction("app/tiles/END_UPDATE");

export const clickTile = (x: number, y: number) => {
  return (dispatch: Dispatch, getState: () => State) => {
    if (x < 1 || y < 1) {
      return;
    }
    const state = getState();
    const tool = selectTool(state);
    const command = selectCurrentCommand(state);
    const tile = selectTile(state, { x, y });
    switch (tool) {
      case "rectangle":
      case "select":
        if (
          state.tool.selecting &&
          !coordinatesMatch(state.tool.selectionEnd, { x, y })
        ) {
          return dispatch(toolActions.updateSelection(x, y));
        }
        if (!state.tool.selecting) {
          return dispatch(toolActions.startSelection(x, y));
        }
        break;
      case "paint":
        if (shouldUpdate(tile, command)) {
          return dispatch(updateTile(x, y, command));
        }
        break;
      case "erase":
        if (tile) {
          return dispatch(removeTile(x, y, command));
        }
        break;
    }
  };
};

export const endClickTile = (x: number, y: number) => {
  return (dispatch: Dispatch, getState: () => State) => {
    const state = getState();
    const tool = selectTool(state);
    const command = selectCurrentCommand(state);
    switch (tool) {
      case "rectangle": {
        // it's possible if some click events get lost
        if (!state.tool.selectionStart) {
          return;
        }
        if (x < 0 || y < 0) {
          return dispatch(toolActions.endSelection());
        }
        const { x: startX, y: startY } = state.tool.selectionStart;
        return dispatch(
          updateTiles(
            Math.min(startX, x),
            Math.min(startY, y),
            Math.max(startX, x),
            Math.max(startY, y),
            command,
          ),
        );
      }
      case "select":
        return dispatch(toolActions.endSelection());
      default:
        return dispatch(endUpdate());
    }
  };
};

const coordinatesMatch = (
  previous: Coordinates | null,
  current: Coordinates | null,
) => {
  if (!current || !previous) {
    return false;
  }
  return previous.x === current.x && previous.y === current.y;
};

const shouldUpdate = (tile: Tile | null, command: Command) => {
  if (!tile) {
    return true;
  }
  // don't bother dispatching the action. necessary since this fires once
  // per frame
  if (tile[command.type] === command.command) {
    return false;
  }
  // need to dig before placing
  // TODO only "dig" is likely valid here, but check
  if (command.type === "item" && tile.designation !== "mine") {
    return false;
  }
  return true;
};
