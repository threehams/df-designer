import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";

import { State } from "./types";

import { tilesReducer } from "./tiles";
import { toolReducer } from "./tool";

const rootReducer = combineReducers<State>({
  tiles: tilesReducer,
  tool: toolReducer,
});

export { State };
export function initializeStore() {
  return createStore(
    rootReducer,
    undefined,
    composeWithDevTools(applyMiddleware(thunkMiddleware)),
  );
}
