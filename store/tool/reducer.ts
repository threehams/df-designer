import produce from "immer";
import { ActionType, getType } from "typesafe-actions";
import { State } from "../";
import * as actions from "./actions";
import { ToolState } from "./types";

const INITIAL_STATE: ToolState = {
  current: "paint",
  last: null,
};

export const toolReducer = (
  state = INITIAL_STATE,
  action: ActionType<typeof actions>,
) => {
  return produce(state, draft => {
    if (
      action.type === getType(actions.setTool) &&
      action.payload.tool !== state.current
    ) {
      draft.last = state.current;
      draft.current = action.payload.tool;
    }
  });
};

export const selectTool = (state: State) => {
  return state.tool.current;
};
