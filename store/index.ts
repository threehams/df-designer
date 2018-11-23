import { applyMiddleware, combineReducers, createStore, Dispatch } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";

import { tilesReducer, TilesState } from "./tiles";
import { toolReducer, ToolState } from "./tool";

export interface State {
  readonly tiles: TilesState;
  readonly tool: ToolState;
}

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
