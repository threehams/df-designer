import {
  createStore,
  applyMiddleware,
  combineReducers,
  Dispatch,
  Action,
} from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import { createAction, ActionType, getType } from "typesafe-actions";
import { flatMap, range } from "lodash";
import produce, { applyPatches, Patch } from "immer";

// models
export type TileStatus = "undug" | "dug" | "smoothed" | "engraved";
export interface Tile {
  x: number;
  y: number;
  status: TileStatus;
}
interface TileCoordinates {
  x: number;
  y: number;
}
type Tool = "paint" | "rectangle" | "erase";
type ToolState = Tool;

interface TilesState {
  readonly width: number;
  readonly height: number;
  readonly selecting: boolean;
  readonly data: { [key: string]: Tile };
}
export interface State {
  readonly tiles: TilesState;
  readonly tool: ToolState;
}

// actions
const updateTile = createAction("tiles/UPDATE_TILE", resolve => {
  return (x: number, y: number) => {
    return resolve({ x, y });
  };
});
export const clickTile = (x: number, y: number) => {
  return (dispatch: Dispatch, getState: () => State) => {
    const state = getState();
    const tool = state.tool;
    if (selectTile(state, { x, y }).status !== "dug") {
      return dispatch(updateTile(x, y));
    }
  };
};
export const startSelection = createAction("tiles/START_SELECTION");
export const resetBoard = createAction("tiles/RESET_BOARD");
export const undo = createAction("tiles/UNDO");
export const redo = createAction("tiles/REDO");
export const selectTool = createAction("tiles/SELECT_TOOL", resolve => {
  return (tool: Tool) => resolve({ tool });
});

type Actions = ActionType<{
  updateTile: typeof updateTile;
  resetBoard: typeof resetBoard;
  startSelection: typeof startSelection;
  undo: typeof undo;
  redo: typeof redo;
  selectTool: typeof selectTool;
}>;

const BOARD_HEIGHT = 20;
const BOARD_WIDTH = 20;

const initialTiles = (width: number, height: number) => {
  return flatMap(range(0, height), x => {
    return range(0, width).map(y => [x, y]);
  }).reduce((result: TilesState["data"], [x, y]) => {
    result[`${x},${y}`] = {
      x,
      y,
      status: "undug",
    };
    return result;
  }, {});
};

const INITIAL_STATE = {
  width: BOARD_HEIGHT,
  height: BOARD_HEIGHT,
  data: initialTiles(BOARD_WIDTH, BOARD_HEIGHT),
  selecting: false,
};

interface History {
  transaction: Patch[];
  past: Patch[][];
  future: Patch[][];
}
const history: History = {
  transaction: [],
  past: [],
  future: [],
};

const tilesReducer = (state: TilesState = INITIAL_STATE, action: Actions) => {
  if (action.type === getType(undo)) {
    console.log(history);
    return state;
  }
  if (action.type === getType(redo)) {
    console.log(history);
    return state;
  }
  return produce(
    state,
    draft => {
      switch (action.type) {
        case getType(updateTile): {
          const { x, y } = action.payload;
          draft.data[`${x},${y}`].status = "dug";
          return;
        }
        case getType(resetBoard): {
          draft.data = initialTiles(state.width, state.height);
          return;
        }
        case getType(startSelection): {
          draft.selecting = true;
          return;
        }
      }
    },
    (patches, inversePatches) => {
      if (inversePatches.length) {
        history.transaction.push(...inversePatches);
      }
      applyPatches(state, patches);
    },
  );
};

export const selectTile = (state: State, { x, y }: TileCoordinates) => {
  return state.tiles.data[`${x},${y}`];
};

const toolReducer = (state: ToolState = "paint", action: Actions) => {
  if (action.type === getType(selectTool)) {
    return action.payload.tool;
  }
  return state;
};

const rootReducer = combineReducers<State>({
  tiles: tilesReducer,
  tool: toolReducer,
});

export function initializeStore() {
  return createStore(
    rootReducer,
    undefined,
    composeWithDevTools(applyMiddleware(thunkMiddleware)),
  );
}
