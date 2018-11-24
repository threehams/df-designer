import { Dispatch } from "redux";
import { createAction } from "typesafe-actions";
import { State } from "../";
import { selectTool, Tool } from "../tool";
import { selectStatus } from "./reducer";
import { TileStatus } from "./types";

export const updateTile = createAction("tiles/UPDATE_TILE", resolve => {
  return (x: number, y: number, status: TileStatus) => {
    return resolve({ x, y, status });
  };
});
export const removeTile = createAction("tiles/REMOVE_TILE", resolve => {
  return (x: number, y: number) => resolve({ x, y, status });
});
export const clickTile = (x: number, y: number) => {
  return (dispatch: Dispatch, getState: () => State) => {
    if (x < 0 || y < 0) {
      return;
    }
    const state = getState();
    const tool = selectTool(state);
    const current = selectStatus(state, { x, y });
    if (!current && tool === "paint") {
      return dispatch(updateTile(x, y, "dug"));
    }
    if (current && tool === "erase") {
      return dispatch(removeTile(x, y));
    }
  };
};
export const resetBoard = createAction("tiles/RESET_BOARD");
export const undo = createAction("tiles/UNDO");
export const redo = createAction("tiles/REDO");
