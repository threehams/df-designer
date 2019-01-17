import { Draft } from "immer";
import keycode from "keycode";
import { Dispatch } from "redux";
import { createAction } from "typesafe-actions";
import * as coordinates from "../../lib/coordinates";
import {
  Adjustment,
  AdjustmentKey,
  Command,
  Phase,
  selectAdjustmentMap,
  selectCommandMap,
  selectCurrentCommand,
  SelectedCoords,
  selectSelection,
  selectTool,
  toolActions,
} from "../tool";
import { State } from "../types";
import { selectTile } from "./reducer";
import { ImportMap, Tile } from "./types";

export const updateTile = createAction("app/tiles/UPDATE_TILE", resolve => {
  return (x: number, y: number, command: Command) => {
    return resolve({ x, y, command });
  };
});
export const setAdjustment = createAction(
  "app/tiles/SET_ADJUSTMENT",
  resolve => {
    return (id: string, name: AdjustmentKey, value: any) => {
      return resolve({ id, name, value });
    };
  },
);
export const fillTiles = createAction("app/tiles/UPDATE_TILES", resolve => {
  return (selection: SelectedCoords, command: Command) => {
    return resolve({ selection, command });
  };
});
export const cloneTiles = createAction("app/tiles/CLONE_TILES", resolve => {
  return (selection: SelectedCoords, toX: number, toY: number) => {
    return resolve({ selection, toX, toY });
  };
});
export const moveTiles = createAction("app/tiles/MOVE_TILES", resolve => {
  return (selection: SelectedCoords, toX: number, toY: number) => {
    return resolve({ selection, toX, toY });
  };
});
export const removeTile = createAction("app/tiles/REMOVE_TILE", resolve => {
  return (x: number, y: number, command: Command) => resolve({ x, y, command });
});
export const removeTiles = createAction("app/tiles/REMOVE_TILES", resolve => {
  return (selection: SelectedCoords) => resolve({ selection });
});
export const resetBoard = createAction("app/tiles/RESET_BOARD");
export const undo = createAction("app/tiles/UNDO");
export const redo = createAction("app/tiles/REDO");
export const endUpdate = createAction("app/tiles/END_UPDATE");
export const removeSelection = () => {
  return (dispatch: Dispatch, getState: () => State) => {
    const selection = selectSelection(getState());
    if (selection) {
      return dispatch(removeTiles(selection));
    }
  };
};
export const flipTiles = createAction("app/tiles/FLIP_TILES", resolve => {
  return (selection: SelectedCoords, direction: "horizontal" | "vertical") =>
    resolve({ selection, direction });
});
export const flipSelection = (direction: "horizontal" | "vertical") => {
  return (dispatch: Dispatch, getState: () => State) => {
    const selection = selectSelection(getState());
    if (selection) {
      return dispatch(flipTiles(selection, direction));
    }
  };
};
export const zLevelUp = createAction("app/tool/Z_LEVEL_UP");
export const zLevelDown = createAction("app/tool/Z_LEVEL_DOWN");
export const importAll = createAction("app/tool/IMPORT_ALL", resolve => {
  const tileMap: { [key: string]: Draft<Tile> } = {};
  return (importMap: ImportMap) => {
    const commandMap = selectCommandMap();
    const adjustmentMap = selectAdjustmentMap();
    const phases: Phase[] = ["dig", "designate", "build", "place", "query"];
    phases
      .filter(phase => !!importMap[phase])
      .forEach(phase => {
        const string = importMap[phase]!;
        string!
          .split("\n")
          .filter(line => !line.startsWith("#"))
          .forEach((line, y) => {
            line.split(",").forEach((shortcut, x) => {
              if (!shortcut || ["`"].includes(shortcut)) {
                return;
              }
              const id = coordinates.toId(x + 1, y + 1);
              let newTile;
              if (phase === "query") {
                const command = tileMap[id].item;
                if (!command) {
                  // tslint:disable-next-line no-console
                  console.log(
                    `received an adjustment with no matching command: ${shortcut}, phase: ${phase}`,
                  );
                }
                const adjustment = Object.values(adjustmentMap).find(
                  adj => adj.shortcut === shortcut[0] && adj.phase === phase,
                );
                if (!adjustment || adjustment.requires !== command) {
                  // tslint:disable-next-line no-console
                  console.log(
                    `unknown adjustment for shortcut: ${shortcut} for command: ${command}`,
                  );
                  return;
                }
                newTile = {
                  adjustments: {
                    ...(tileMap[id] || {}).adjustments,
                    ...adjustmentData(adjustment, shortcut),
                  },
                };
              } else {
                const command = Object.values(commandMap).find(
                  comm => comm.shortcut === shortcut && comm.phase === phase,
                );
                if (!command) {
                  // tslint:disable-next-line no-console
                  console.log(
                    `unknown command for shortcut: ${shortcut}, phase: ${phase}`,
                  );
                  return;
                }
                newTile = {
                  [command.type]: command.command,
                };
              }
              if (!tileMap[id]) {
                tileMap[id] = {
                  id,
                  designation: null,
                  item: null,
                  adjustments: {},
                };
              }
              tileMap[id] = {
                ...tileMap[id],
                ...newTile,
              };
            });
          });
      });
    return resolve({ imports: Object.values(tileMap) });
  };
});

const adjustmentData = (adjustment: Adjustment, shortcut: string) => {
  if (adjustment.type === "resize") {
    const increment = shortcut.split("").filter(char => char === "+").length;
    const decrement = -shortcut.split("").filter(char => char === "-").length;
    return {
      [adjustment.command]: adjustment.initialSize + increment + decrement,
    };
  } else if (adjustment.type === "select") {
    return { [adjustment.selectCommand]: shortcut };
  }
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
    const selection = selectSelection(state);
    switch (tool) {
      case "rectangle":
        if (
          state.tool.selecting &&
          !coordinates.match(state.tool.selectionEnd, { x, y })
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
          coordinates.match(state.tool.selectionEnd, { x, y })
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
        if (!state.tool.dragging && coordinates.within(selection, { x, y })) {
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
  keysPressed: Array<keyof typeof keycode.codes>,
) => {
  return (dispatch: Dispatch, getState: () => State) => {
    const state = getState();
    const tool = selectTool(state);
    const command = selectCurrentCommand(state);
    const selection = selectSelection(state);
    switch (tool) {
      case "rectangle": {
        // it's possible if some click events get lost
        if (!selection) {
          return;
        }
        return dispatch(fillTiles(selection, command));
      }
      case "select": {
        // get rid of all the nulls right away
        if (!state.tool.dragging) {
          return dispatch(toolActions.endSelection());
        }
        if (!selection || !state.tool.dragStart || !state.tool.dragEnd) {
          return;
        }
        const toX =
          state.tool.dragEnd.x - (state.tool.dragStart.x - selection.startX);
        const toY =
          state.tool.dragEnd.y - (state.tool.dragStart.y - selection.startY);
        if (keysPressed.includes("shift")) {
          return dispatch(cloneTiles(selection, toX, toY));
        } else {
          return dispatch(moveTiles(selection, toX, toY));
        }
      }
      default:
        return dispatch(endUpdate());
    }
  };
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
