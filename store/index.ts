import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";

import { State } from "./types";

import { tilesReducer } from "./reducers/tilesReducer";
import { toolReducer } from "./reducers/toolReducer";

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
