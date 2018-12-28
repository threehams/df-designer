import produce from "immer";
import { ActionType, getType } from "typesafe-actions";
import { State } from "../types";
import * as actions from "./actions";
import * as tilesActions from "../tiles/actions";
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
  selectionEnd: null,
  phase: "dig",
  command: "mine",
  io: null,
  selectedItem: null,
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
          if (action.payload.tool !== "select") {
            draft.selectionStart = null;
            draft.selectionEnd = null;
          }
        }
        return;
      }
      case getType(actions.setIo): {
        draft.io = action.payload.io;
        return;
      }
      case getType(actions.startSelection): {
        draft.selectionStart = { x: action.payload.x, y: action.payload.y };
        draft.selectionEnd = { x: action.payload.x, y: action.payload.y };
        return;
      }
      case getType(actions.updateSelection): {
        draft.selectionEnd = {
          x: action.payload.x,
          y: action.payload.y,
        };
        return;
      }
      case getType(actions.endSelection):
      case getType(tilesActions.updateTiles):
        draft.selectionStart = null;
        draft.selectionEnd = null;
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
        if (draft.current === "erase") {
          draft.last = "erase";
          draft.current = "paint";
        }
        return;
      case getType(toolActions.setSelectedItem):
        draft.selectedItem = { x: action.payload.x, y: action.payload.y };
        return;
    }
  });
};

export const selectTool = (state: State) => {
  return state.tool.current;
};

export const selectCurrentCommand = (state: State) => {
  const commandMap = selectCommandMap();
  return commandMap[state.tool.command];
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

const phaseValues = Object.values(phases);

export const selectPhases = () => {
  return phaseValues;
};
