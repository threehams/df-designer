import produce from "immer";
import { ActionType, getType } from "typesafe-actions";
import { State } from "../";
import * as actions from "./actions";
import { tilesActions } from "../tiles";
import { ToolState } from "./types";

const INITIAL_STATE: ToolState = {
  current: "paint",
  last: null,
  export: false,
  selectionStart: null,
};

export const toolReducer = (
  state = INITIAL_STATE,
  action: ActionType<typeof actions | typeof tilesActions>,
) => {
  return produce(state, draft => {
    switch (action.type) {
      case getType(actions.setTool): {
        if (action.payload.tool !== state.current) {
          draft.last = state.current;
          draft.current = action.payload.tool;
        }
        return;
      }
      case getType(actions.toggleExport): {
        draft.export = !state.export;
        return;
      }
      case getType(actions.startSelection): {
        draft.selectionStart = { x: action.payload.x, y: action.payload.y };
        return;
      }
      case getType(actions.endSelection): {
        draft.selectionStart = null;
        return;
      }
      case getType(tilesActions.updateTiles):
        draft.selectionStart = null;
        return;
    }
  });
};

export const selectTool = (state: State) => {
  return state.tool.current;
};
