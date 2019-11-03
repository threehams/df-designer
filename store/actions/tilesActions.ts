import { Draft } from "immer";
import keycode from "keycode";
import { Dispatch } from "redux";
import { createAction } from "typesafe-actions";
import { toolActions } from ".";
import * as coordinates from "../../lib/coordinates";
import { selectTile } from "../reducers/tilesReducer";
import {
  selectAdjustmentMap,
  selectCommandMap,
  selectCurrentCommand,
  selectSelection,
  selectTool,
} from "../reducers/toolReducer";
import {
  Adjustment,
  AdjustmentKey,
  Command,
  ImportMap,
  PhaseSlug,
  SelectedCoords,
  State,
  Tile,
  TilesState,
  Coords,
} from "../types";

export const hydrateTiles = () => {
  return (dispatch: Dispatch) => {
    try {
      const json = localStorage.getItem("df-designer-state");
      if (!json) {
        return;
      }
      const tiles = JSON.parse(json);
      if (tiles) {
        dispatch(setTilesState({ tiles }));
      }
    } catch (err) {
      // nothing available or privacy settings disallow localStorage
    }
  };
};
export const setTilesState = createAction("app/tiles/SET_TILES_STATE")<{
  tiles: TilesState["data"];
}>();

export const updateTile = createAction("app/tiles/UPDATE_TILE")<{
  x: number;
  y: number;
  command: Command;
}>();
export const setAdjustment = createAction("app/tiles/SET_ADJUSTMENT")<{
  id: string;
  name: AdjustmentKey;
  value: number | string;
}>();
export const fillTiles = createAction("app/tiles/UPDATE_TILES")<{
  selection: SelectedCoords;
  command: Command;
}>();
export const cloneTiles = createAction("app/tiles/CLONE_TILES")<{
  selection: SelectedCoords;
  toX: number;
  toY: number;
}>();
export const moveTiles = createAction("app/tiles/MOVE_TILES")<{
  selection: SelectedCoords;
  toX: number;
  toY: number;
}>();
export const removeTile = createAction("app/tiles/REMOVE_TILE")<{
  x: number;
  y: number;
  command: Command;
}>();
export const removeTiles = createAction("app/tiles/REMOVE_TILES")<{
  selection: SelectedCoords;
}>();
export const resetBoard = createAction("app/tiles/RESET_BOARD")();
export const undo = createAction("app/tiles/UNDO")();
export const redo = createAction("app/tiles/REDO")();
export const endUpdate = createAction("app/tiles/END_UPDATE")();
export const removeSelection = () => {
  return (dispatch: Dispatch, getState: () => State) => {
    const selection = selectSelection(getState());
    if (selection) {
      return dispatch(removeTiles({ selection }));
    }
  };
};
export const flipTiles = createAction("app/tiles/FLIP_TILES")<{
  selection: SelectedCoords;
  direction: "horizontal" | "vertical";
}>();
export const flipSelection = (direction: "horizontal" | "vertical") => {
  return (dispatch: Dispatch, getState: () => State) => {
    const selection = selectSelection(getState());
    if (selection) {
      return dispatch(flipTiles({ selection, direction }));
    }
  };
};
export const zLevelUp = createAction("app/tool/Z_LEVEL_UP")();
export const zLevelDown = createAction("app/tool/Z_LEVEL_DOWN")();
export const clickTile = (coords: Coords) => {
  return (dispatch: Dispatch, getState: () => State) => {
    if (coords.x < 1 || coords.y < 1) {
      return;
    }
    const state = getState();
    const tool = selectTool(state);
    const command = selectCurrentCommand(state);
    const tile = selectTile(state, coords);
    const selection = selectSelection(state);
    switch (tool) {
      case "rectangle":
        if (
          state.tool.selecting &&
          !coordinates.match(state.tool.selectionEnd, coords)
        ) {
          return dispatch(toolActions.updateSelection(coords));
        }
        if (!state.tool.selecting) {
          return dispatch(toolActions.startSelection(coords));
        }
        break;
      case "select":
        if (
          (state.tool.selecting || state.tool.dragging) &&
          coordinates.match(state.tool.selectionEnd, coords)
        ) {
          // don't bother dispatching action - prevents noise in devtools
          return;
        }

        if (state.tool.selecting) {
          return dispatch(toolActions.updateSelection(coords));
        }
        if (state.tool.dragging) {
          return dispatch(toolActions.updateDrag(coords));
        }
        if (!state.tool.dragging && coordinates.within(selection, coords)) {
          return dispatch(toolActions.startDrag(coords));
        }
        if (!state.tool.selecting) {
          return dispatch(toolActions.startSelection(coords));
        }
        break;
      case "paint":
        if (shouldUpdate(tile, command)) {
          return dispatch(updateTile({ ...coords, command }));
        }
        break;
      case "erase":
        if (tile) {
          return dispatch(removeTile({ ...coords, command }));
        }
        break;
    }
  };
};

export const endClickTile = (keysPressed: (keyof typeof keycode.codes)[]) => {
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
        return dispatch(fillTiles({ selection, command }));
      }
      case "select": {
        // get rid of all the undefineds right away
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
          return dispatch(cloneTiles({ selection, toX, toY }));
        } else {
          return dispatch(moveTiles({ selection, toX, toY }));
        }
      }
      default:
        return dispatch(endUpdate());
    }
  };
};
export const importAll = createAction(
  "app/tool/IMPORT_ALL",
  ({ importMap }: { importMap: ImportMap }) => {
    const tileMap: { [key: string]: Draft<Tile> } = {};
    const commandMap = selectCommandMap();
    const adjustmentMap = selectAdjustmentMap();
    const phases: PhaseSlug[] = ["dig", "designate", "build", "place", "query"];
    phases
      .filter(phase => !!importMap[phase])
      .forEach(phase => {
        const string = importMap[phase]!;
        string
          .split("\n")
          .filter(line => !line.startsWith("#"))
          .forEach((line, y) => {
            line.split(",").forEach((shortcut, x) => {
              if (!shortcut || ["~"].includes(shortcut)) {
                return;
              }
              const id = coordinates.toId(x + 1, y + 1);
              let newTile;
              if (phase === "query") {
                if (!tileMap[id]) {
                  // tslint:disable-next-line no-console
                  console.warn(
                    `cannot add an adjustment to a tile with no item: ${shortcut}, phase: ${phase} at ${id}`,
                  );
                  return;
                }
                const commandSlug = tileMap[id].item;
                if (!commandSlug) {
                  // tslint:disable-next-line no-console
                  console.warn(
                    `received an adjustment with no matching command: ${shortcut}, phase: ${phase} at ${id}`,
                  );
                  return;
                }
                const adjustment = Object.values(adjustmentMap).find(
                  adj => adj.shortcut === shortcut[0] && adj.phase === phase,
                );
                if (!adjustment || adjustment.requires !== commandSlug) {
                  // tslint:disable-next-line no-console
                  console.warn(
                    `unknown adjustment for shortcut: ${shortcut} for command: ${commandSlug}, phase: ${phase} at ${id}`,
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
                  console.warn(
                    `unknown command for shortcut: ${shortcut}, phase: ${phase} at ${id}`,
                  );
                  return;
                }
                if (
                  command.type === "item" &&
                  (!tileMap[id] || tileMap[id].designation !== "mine")
                ) {
                  // tslint:disable-next-line no-console
                  console.warn(
                    `cannot add an item to a space which is not mined: ${shortcut}, phase: ${phase} at ${id}`,
                  );
                  return;
                }
                newTile = {
                  [command.type]: command.slug,
                };
              }
              if (!tileMap[id]) {
                tileMap[id] = {
                  id,
                  coordinates: coordinates.fromId(id),
                  designation: undefined,
                  item: undefined,
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
    return { imports: Object.values(tileMap) };
  },
)();

const adjustmentData = (adjustment: Adjustment, shortcut: string) => {
  if (adjustment.type === "resize") {
    const increment = shortcut.split("").filter(char => char === "+").length;
    const decrement = -shortcut.split("").filter(char => char === "-").length;
    return {
      [adjustment.slug]: adjustment.initialSize + increment + decrement,
    };
  } else if (adjustment.type === "select") {
    return { [adjustment.selectCommand]: shortcut };
  }
};

const shouldUpdate = (tile: Tile | undefined, command: Command) => {
  if (!tile) {
    return true;
  }
  // don't bother dispatching the action. necessary since this fires once
  // per frame
  if (tile[command.type] === command.slug) {
    return false;
  }
  // need to dig before placing
  // TODO only "dig" is likely valid here, but check
  if (command.type === "item" && tile.designation !== "mine") {
    return false;
  }
  return true;
};
