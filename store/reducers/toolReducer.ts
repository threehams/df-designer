import produce from "immer";
import { createSelector } from "reselect";
import { ActionType, getType } from "typesafe-actions";
import { adjustments, commands } from "../../static/commands";
import { phases } from "../../static/phases";
import { tilesActions, toolActions } from "../actions";
import { PhaseSlug, State, ToolState } from "../types";

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
  action: ActionType<typeof toolActions | typeof tilesActions>,
) => {
  return produce(state, draft => {
    switch (action.type) {
      case getType(toolActions.setTool): {
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
      case getType(toolActions.setIo): {
        draft.io = action.payload.io;
        break;
      }
      case getType(toolActions.startSelection): {
        const { x, y } = action.payload;
        draft.selectionStart = { x, y };
        draft.selectionEnd = { x, y };
        draft.selecting = true;
        break;
      }
      case getType(toolActions.updateSelection): {
        const { x, y } = action.payload;
        draft.selectionEnd = { x, y };
        break;
      }
      case getType(toolActions.endSelection):
        draft.selectionStart = {
          x: Math.min(state.selectionStart!.x, state.selectionEnd!.x),
          y: Math.min(state.selectionStart!.y, state.selectionEnd!.y),
        };
        draft.selectionEnd = {
          x: Math.max(state.selectionStart!.x, state.selectionEnd!.x),
          y: Math.max(state.selectionStart!.y, state.selectionEnd!.y),
        };
        draft.selecting = false;
        break;
      case getType(toolActions.cancel):
      case getType(tilesActions.fillTiles):
        draft.selecting = false;
        draft.selectionStart = null;
        draft.selectionEnd = null;
        break;
      case getType(tilesActions.cloneTiles):
      case getType(tilesActions.moveTiles): {
        const { selection, toX, toY } = action.payload;
        draft.dragging = false;
        draft.selectionStart = {
          x: toX,
          y: toY,
        };
        draft.selectionEnd = {
          x: toX + (selection.endX - selection.startX),
          y: toY + (selection.endY - selection.startY),
        };
        draft.dragStart = null;
        draft.dragEnd = null;
        break;
      }
      case getType(toolActions.setPhase): {
        const { phaseSlug } = action.payload;
        if (draft.phase !== phaseSlug) {
          draft.phase = phaseSlug;
          // this is weird
          draft.command = selectCommands({}, { phase: phaseSlug })[0].slug;
        }
        break;
      }
      case getType(toolActions.setCommand):
        draft.command = action.payload.commandSlug;
        if (draft.current === "erase") {
          draft.last = "erase";
          draft.current = "paint";
        }
        break;
      case getType(toolActions.startDrag): {
        const { x, y } = action.payload;
        draft.dragStart = { x, y };
        draft.dragEnd = { x, y };
        draft.dragging = true;
        break;
      }
      case getType(toolActions.updateDrag): {
        const { x, y } = action.payload;
        draft.dragEnd = { x, y };
        break;
      }
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
  (_: any, props: { phase: PhaseSlug | null }) => props.phase,
  phase => {
    return Object.values(commands).filter(command =>
      phase ? command.phase === phase : true,
    );
  },
);

export const selectCommandMap = () => commands;
export const selectAdjustmentMap = () => adjustments;

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

export const selectSelection = createSelector(
  (state: State) => state.tool.selectionStart,
  (state: State) => state.tool.selectionEnd,
  (start, end) => {
    if (!start || !end) {
      return null;
    }
    return {
      startX: Math.min(start.x, end.x),
      startY: Math.min(start.y, end.y),
      endX: Math.max(start.x, end.x),
      endY: Math.max(start.y, end.y),
    };
  },
);
