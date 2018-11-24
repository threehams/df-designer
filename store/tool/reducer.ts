import produce from "immer";
import { ActionType, getType } from "typesafe-actions";
import { State } from "../";
import * as actions from "./actions";
import { ToolState } from "./types";

const INITIAL_STATE: ToolState = {
  current: "paint",
  last: null,
  export: false,
};

export const toolReducer = (
  state = INITIAL_STATE,
  action: ActionType<typeof actions>,
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
    }
  });
};

export const selectTool = (state: State) => {
  return state.tool.current;
};
