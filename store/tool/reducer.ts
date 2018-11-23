import { ActionType, getType } from "typesafe-actions";
import * as actions from "./actions";
import { ToolState } from "./types";

export const toolReducer = (
  state: ToolState = "paint",
  action: ActionType<typeof actions>,
) => {
  if (action.type === getType(actions.setTool)) {
    return action.payload.tool;
  }
  return state;
};
