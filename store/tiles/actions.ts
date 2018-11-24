import { Dispatch } from "redux";
import { createAction } from "typesafe-actions";
import { State } from "../";
import { selectTool } from "../tool";
import { selectStatus } from "./reducer";
import { TileStatus } from "./types";
import { toolActions } from "../tool";

export const updateTile = createAction("app/tiles/UPDATE_TILE", resolve => {
  return (x: number, y: number, status: TileStatus) => {
    return resolve({ x, y, status });
  };
});
export const updateTiles = createAction("app/tiles/UPDATE_TILES", resolve => {
  return (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    status: TileStatus,
  ) => {
    return resolve({ startX, startY, endX, endY, status });
  };
});
export const updateSelection = createAction(
  "app/tiles/UPDATE_SELECTION",
  resolve => {
    return (x: number, y: number) => resolve();
  },
);
export const removeTile = createAction("app/tiles/REMOVE_TILE", resolve => {
  return (x: number, y: number) => resolve({ x, y, status });
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
    const currentTile = selectStatus(state, { x, y });
    if (tool === "rectangle" && !state.tool.selectionStart) {
      return dispatch(toolActions.startSelection(x, y));
    }
    if (!currentTile && tool === "paint") {
      return dispatch(updateTile(x, y, "dug"));
    }
    if (currentTile && tool === "erase") {
      return dispatch(removeTile(x, y));
    }
  };
};
export const endClickTile = (x: number, y: number) => {
  return (dispatch: Dispatch, getState: () => State) => {
    const state = getState();
    const tool = selectTool(state);
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
        "dug",
      ),
    );
  };
};
