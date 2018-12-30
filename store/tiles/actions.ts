import { Dispatch } from "redux";
import { createAction } from "typesafe-actions";
import { State } from "../types";
import {
  selectTool,
  selectCurrentCommand,
  toolActions,
  Command,
  Coordinates,
} from "../tool";
import { selectTile } from "./reducer";
import { Tile } from "./types";
import { withinCoordinates } from "../../lib/withinCoordinates";
import keycode from "keycode";

export const updateTile = createAction("app/tiles/UPDATE_TILE", resolve => {
  return (x: number, y: number, command: Command) => {
    return resolve({ x, y, command });
  };
});
export const setAdjustment = createAction(
  "app/tiles/SET_ADJUSTMENT",
  resolve => {
    return (id: string, name: string, value: any) => {
      return resolve({ id, name, value });
    };
  },
);
export const fillTiles = createAction("app/tiles/UPDATE_TILES", resolve => {
  return (
    // TODO use an object and unify start/end/min/max all around
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    command: Command,
  ) => {
    return resolve({ startX, startY, endX, endY, command });
  };
});
export const cloneTiles = createAction("app/tiles/CLONE_TILES", resolve => {
  return (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    toX: number,
    toY: number,
  ) => {
    return resolve({ startX, startY, endX, endY, toX, toY });
  };
});
export const moveTiles = createAction("app/tiles/MOVE_TILES", resolve => {
  return (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    toX: number,
    toY: number,
  ) => {
    return resolve({ startX, startY, endX, endY, toX, toY });
  };
});
export const removeTile = createAction("app/tiles/REMOVE_TILE", resolve => {
  return (x: number, y: number, command: Command) => resolve({ x, y, command });
});
export const removeTiles = createAction("app/tiles/REMOVE_TILES", resolve => {
  return (
    // TODO use an object and unify start/end/min/max all around
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    command: Command,
  ) => {
    return resolve({ startX, startY, endX, endY, command });
  };
});
export const resetBoard = createAction("app/tiles/RESET_BOARD");
export const undo = createAction("app/tiles/UNDO");
export const redo = createAction("app/tiles/REDO");
export const endUpdate = createAction("app/tiles/END_UPDATE");
export const flip = createAction("app/tiles/FLIP", resolve => {
  return (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    direction: "horizontal" | "vertical",
  ) => resolve({ startX, startY, endX, endY, direction });
});

export const flipSelection = (direction: "horizontal" | "vertical") => {
  return (dispatch: Dispatch, getState: () => State) => {
    const { selectionStart, selectionEnd } = getState().tool;
    if (!selectionStart || !selectionEnd) {
      return;
    }
    return dispatch(
      flip(
        selectionStart.x,
        selectionStart.y,
        selectionEnd.x,
        selectionEnd.y,
        direction,
      ),
    );
  };
};

export const clickTile = (x: number, y: number) => {
  return (dispatch: Dispatch, getState: () => State) => {
    if (x < 1 || y < 1) {
      return;
    }
    const state = getState();
    const tool = selectTool(state);
    const command = selectCurrentCommand(state);
    const tile = selectTile(state, { x, y });
    switch (tool) {
      case "rectangle":
        if (
          state.tool.selecting &&
          !coordinatesMatch(state.tool.selectionEnd, { x, y })
        ) {
          return dispatch(toolActions.updateSelection(x, y));
        }
        if (!state.tool.selecting) {
          return dispatch(toolActions.startSelection(x, y));
        }
        break;
      case "select":
        if (
          (state.tool.selecting || state.tool.dragging) &&
          coordinatesMatch(state.tool.selectionEnd, { x, y })
        ) {
          // don't bother dispatching action - prevents noise in devtools
          return;
        }

        if (state.tool.selecting) {
          return dispatch(toolActions.updateSelection(x, y));
        }
        if (state.tool.dragging) {
          return dispatch(toolActions.updateDrag(x, y));
        }
        if (
          !state.tool.dragging &&
          withinCoordinates(
            state.tool.selectionStart,
            state.tool.selectionEnd,
            { x, y },
          )
        ) {
          return dispatch(toolActions.startDrag(x, y));
        }
        if (!state.tool.selecting) {
          return dispatch(toolActions.startSelection(x, y));
        }
        break;
      case "paint":
        if (shouldUpdate(tile, command)) {
          return dispatch(updateTile(x, y, command));
        }
        break;
      case "erase":
        if (tile) {
          return dispatch(removeTile(x, y, command));
        }
        break;
    }
  };
};

export const endClickTile = (
  x: number,
  y: number,
  keyPressed: keyof typeof keycode.codes | null,
) => {
  return (dispatch: Dispatch, getState: () => State) => {
    const state = getState();
    const tool = selectTool(state);
    const command = selectCurrentCommand(state);
    switch (tool) {
      case "rectangle": {
        // it's possible if some click events get lost
        if (!state.tool.selectionStart) {
          return;
        }
        if (x < 0 || y < 0) {
          return dispatch(toolActions.endSelection());
        }
        const { x: startX, y: startY } = state.tool.selectionStart;
        return dispatch(
          fillTiles(
            // TODO source of bugs here, maybe fix when writing to state?
            Math.min(startX, x),
            Math.min(startY, y),
            Math.max(startX, x),
            Math.max(startY, y),
            command,
          ),
        );
      }
      case "select": {
        // get rid of all the nulls right away
        if (!state.tool.dragging) {
          return dispatch(toolActions.endSelection());
        }
        if (
          !state.tool.selectionStart ||
          !state.tool.selectionEnd ||
          !state.tool.dragStart ||
          !state.tool.dragEnd
        ) {
          return;
        }
        const { x: startX, y: startY } = state.tool.selectionStart;
        const { x: endX, y: endY } = state.tool.selectionEnd;
        const toX = state.tool.dragEnd.x - (state.tool.dragStart.x - startX);
        const toY = state.tool.dragEnd.y - (state.tool.dragStart.y - startY);
        if (keyPressed === "shift") {
          return dispatch(cloneTiles(startX, startY, endX, endY, toX, toY));
        } else {
          return dispatch(moveTiles(startX, startY, endX, endY, toX, toY));
        }
      }
      default:
        return dispatch(endUpdate());
    }
  };
};

const coordinatesMatch = (
  previous: Coordinates | null,
  current: Coordinates | null,
) => {
  if (!current || !previous) {
    return false;
  }
  return previous.x === current.x && previous.y === current.y;
};

const shouldUpdate = (tile: Tile | null, command: Command) => {
  if (!tile) {
    return true;
  }
  // don't bother dispatching the action. necessary since this fires once
  // per frame
  if (tile[command.type] === command.command) {
    return false;
  }
  // need to dig before placing
  // TODO only "dig" is likely valid here, but check
  if (command.type === "item" && tile.designation !== "mine") {
    return false;
  }
  return true;
};
