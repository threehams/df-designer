import produce from "immer";
import { ActionType, getType } from "typesafe-actions";
import { State } from "../";
import * as actions from "./actions";
import { tilesActions } from "../tiles";
import { ToolState, Phase } from "./types";
import { toolActions } from ".";
import { commands } from "./commands";
import { phases } from "./phases";
import { createSelector } from "reselect";

const INITIAL_STATE: ToolState = {
  current: "paint",
  last: null,
  export: false,
  selectionStart: null,
  phase: "dig",
  command: "mine",
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
      case getType(actions.endSelection):
      case getType(tilesActions.updateTiles):
        draft.selectionStart = null;
        return;
      case getType(toolActions.setPhase):
        if (draft.phase !== action.payload.phase) {
          draft.phase = action.payload.phase;
          // this is weird
          draft.command = selectCommands(
            {},
            { phase: action.payload.phase },
          )[0].command;
        }
        return;
      case getType(toolActions.setCommand):
        draft.command = action.payload.command;
        if (draft.current === "fillIn") {
          draft.last = "fillIn";
          draft.current = "paint";
        }
        return;
    }
  });
};

export const selectTool = (state: State) => {
  return state.tool.current;
};

export const selectCommand = (state: State) => {
  return state.tool.command;
};

export const selectCommands = createSelector(
  (_: any, props: { phase: Phase | null }) => props.phase,
  phase => {
    return Object.values(commands).filter(command =>
      phase ? command.phase === phase : true,
    );
  },
);

export const selectCommandMap = () => commands;

export const selectPhase = (state: State) => {
  return state.tool.phase;
};

export const selectPhases = () => {
  return Object.values(phases);
};
