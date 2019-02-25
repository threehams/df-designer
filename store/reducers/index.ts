import { combineReducers } from "redux";
import { State } from "../types";
import { tilesReducer } from "./tilesReducer";
import { toolReducer } from "./toolReducer";

export const rootReducer = combineReducers<State>({
  tiles: tilesReducer,
  tool: toolReducer,
});
