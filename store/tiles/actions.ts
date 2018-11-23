import { Dispatch } from "redux";
import { createAction } from "typesafe-actions";
import { State } from "../";
import { selectTool, Tool } from "../tool";
import { selectTile } from "./reducer";
import { TileStatus } from "./types";

const toolStatus: { [key in Tool]: TileStatus } = {
  paint: "dug",
  erase: "undug",
};

export const updateTile = createAction("tiles/UPDATE_TILE", resolve => {
  return (x: number, y: number, status: TileStatus) => {
    return resolve({ x, y, status });
  };
});
export const clickTile = (x: number, y: number) => {
  return (dispatch: Dispatch, getState: () => State) => {
    const state = getState();
    const tool = selectTool(state);
    const status = toolStatus[tool];
    if (selectTile(state, { x, y }).status !== status) {
      return dispatch(updateTile(x, y, status));
    }
  };
};
export const startSelection = createAction("tiles/START_SELECTION");
export const resetBoard = createAction("tiles/RESET_BOARD");
export const undo = createAction("tiles/UNDO");
export const redo = createAction("tiles/REDO");
