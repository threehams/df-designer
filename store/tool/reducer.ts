import produce from "immer";
import { ActionType, getType } from "typesafe-actions";
import { State } from "../";
import * as actions from "./actions";
import { tilesActions } from "../tiles";
import { ToolState, Phase, PhaseConfig, CommandConfig } from "./types";
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
  command: null,
  phases: [],
  commands: [],
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
        draft.phase = action.payload.phase;
        return;
      case getType(toolActions.setCommand):
        draft.command = action.payload.command;
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
  (_: State, props: { phase: Phase }) => props.phase,
  phase => {
    return Object.values(commands).filter(
      command => command.phase === phase,
    ) as CommandConfig[];
  },
);

export const selectPhase = (state: State) => {
  return state.tool.phase;
};

export const selectPhases = (state: State) => {
  return Object.values(phases) as PhaseConfig[];
};
