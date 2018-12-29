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
  command: "mine",
  current: "paint",
  dragEnd: null,
  dragging: false,
  dragStart: null,
  export: false,
  io: null,
  last: null,
  phase: "dig",
  selecting: false,
  selectionEnd: null,
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
          if (action.payload.tool !== "select") {
            draft.selectionStart = null;
            draft.selectionEnd = null;
          }
        }
        break;
      }
      case getType(actions.setIo): {
        draft.io = action.payload.io;
        break;
      }
      case getType(actions.startSelection): {
        draft.selectionStart = { x: action.payload.x, y: action.payload.y };
        draft.selectionEnd = { x: action.payload.x, y: action.payload.y };
        draft.selecting = true;
        break;
      }
      case getType(actions.updateSelection): {
        draft.selectionEnd = {
          x: action.payload.x,
          y: action.payload.y,
        };
        break;
      }
      case getType(actions.endSelection):
        draft.selecting = false;
        break;
      case getType(tilesActions.updateTiles):
        draft.selecting = false;
        draft.selectionStart = null;
        draft.selectionEnd = null;
        break;
      case getType(tilesActions.cloneTiles):
        draft.dragging = false;
        draft.selectionStart = {
          x: action.payload.toX,
          y: action.payload.toY,
        };
        draft.selectionEnd = {
          x: action.payload.toX + (action.payload.endX - action.payload.startX),
          y: action.payload.toY + (action.payload.endY - action.payload.startY),
        };
        draft.dragStart = null;
        draft.dragEnd = null;
        break;
      case getType(toolActions.setPhase):
        if (draft.phase !== action.payload.phase) {
          draft.phase = action.payload.phase;
          // this is weird
          draft.command = selectCommands(
            {},
            { phase: action.payload.phase },
          )[0].command;
        }
        break;
      case getType(toolActions.setCommand):
        draft.command = action.payload.command;
        if (draft.current === "erase") {
          draft.last = "erase";
          draft.current = "paint";
        }
        break;
      case getType(toolActions.startDrag):
        draft.dragStart = { x: action.payload.x, y: action.payload.y };
        draft.dragEnd = { x: action.payload.x, y: action.payload.y };
        draft.dragging = true;
        break;
      case getType(toolActions.updateDrag):
        draft.dragEnd = { x: action.payload.x, y: action.payload.y };
        break;
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

export const selectSelectionOffset = createSelector(
  (state: State) => state.tool.dragStart,
  (state: State) => state.tool.dragEnd,
  (state: State) => state.tool.dragging,
  (dragStart, dragEnd, dragging) => {
    if (!dragStart || !dragEnd || !dragging) {
      return { x: 0, y: 0 };
    }
    return {
      x: dragEnd.x - dragStart.x,
      y: dragEnd.y - dragStart.y,
    };
  },
);
