import { Dispatch } from "redux";
import { createAction } from "typesafe-actions";
import { State } from "../";
import { selectTool, selectCommand, selectCommandMap } from "../tool";
import { selectTile } from "./reducer";
import { Command, CommandConfig } from "../tool/types";
import { toolActions } from "../tool";

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
    if (x < 0 || y < 0) {
      return;
    }
    const state = getState();
    const tool = selectTool(state);
    const command = selectCommand(state);
    const tileCommand = selectTile(state, { x, y });
    const commandMap = selectCommandMap();
    if (tool === "rectangle" && !state.tool.selectionStart) {
      return dispatch(toolActions.startSelection(x, y));
    }
    if (tool === "paint") {
      if (
        shouldUpdate(
          (tileCommand || []).map(c => commandMap[c]),
          commandMap[command],
        )
      ) {
        return dispatch(updateTile(x, y, command));
      }
    }
    if (tileCommand && tool === "fillIn") {
      return dispatch(removeTile(x, y, command));
    }
  };
};
export const endClickTile = (x: number, y: number) => {
  return (dispatch: Dispatch, getState: () => State) => {
    const state = getState();
    const tool = selectTool(state);
    const command = selectCommand(state);
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

const shouldUpdate = (
  tileCommands: CommandConfig[],
  command: CommandConfig,
) => {
  if (tileCommands.includes(command)) {
    return false;
  }
  if (
    (command.phase !== "dig" &&
      !tileCommands.filter(c => c.phase === "dig").length) ||
    tileCommands.filter(c => c.phase !== "dig").length
  ) {
    return false;
  }
  return true;
};
