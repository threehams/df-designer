import { Dispatch } from "redux";
import { createAction } from "typesafe-actions";
import { State } from "../types";
import { selectTool, selectCurrentCommand, selectCommandMap } from "../tool";
import { selectTile } from "./reducer";
import { Command } from "../tool/types";
import { toolActions } from "../tool";
import { idFromCoordinates } from "../../lib/coordinatesFromId";
import { Tile } from "./types";

export const updateTile = createAction("app/tiles/UPDATE_TILE", resolve => {
  return (x: number, y: number, command: Command) => {
    return resolve({ x, y, command });
  };
});
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
export const updateSelection = createAction(
  "app/tiles/UPDATE_SELECTION",
  resolve => {
    return (x: number, y: number) => resolve();
  },
);
export const removeTile = createAction("app/tiles/REMOVE_TILE", resolve => {
  return (x: number, y: number, command: Command) => resolve({ x, y, command });
});
export const resetBoard = createAction("app/tiles/RESET_BOARD");
export const undo = createAction("app/tiles/UNDO");
export const redo = createAction("app/tiles/REDO");

export const clickTile = (x: number, y: number) => {
  return (dispatch: Dispatch, getState: () => State) => {
    if (x < 1 || y < 1) {
      return;
    }
    const id = idFromCoordinates(x, y);
    const state = getState();
    const tool = selectTool(state);
    const command = selectCurrentCommand(state);
    const tile = selectTile(state, { x, y });
    const commandMap = selectCommandMap();
    if (tool === "rectangle" && !state.tool.selectionStart) {
      return dispatch(toolActions.startSelection(x, y));
    }
    if (tool === "paint") {
      if (shouldUpdate(tile, command)) {
        return dispatch(updateTile(x, y, command));
      }
    }
    if (tile && tool === "erase") {
      return dispatch(removeTile(x, y, command));
    }
    if (tool === "select" && state.tiles.data[id]) {
      dispatch(toolActions.setSelectedItem(x, y));
    }
  };
};
export const endClickTile = (x: number, y: number) => {
  return (dispatch: Dispatch, getState: () => State) => {
    const state = getState();
    const tool = selectTool(state);
    const command = selectCurrentCommand(state);
    if (tool !== "rectangle" || !state.tool.selectionStart) {
      return;
    }
    const { x: startX, y: startY } = state.tool.selectionStart;
    if (x < 0 || y < 0) {
      return dispatch(toolActions.endSelection());
    }
    dispatch(
      updateTiles(
        Math.min(startX, x),
        Math.min(startY, y),
        Math.max(startX, x),
        Math.max(startY, y),
        command,
      ),
    );
  };
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
  if (command.type === "item" && !tile.designation) {
    return false;
  }
  return true;
};
