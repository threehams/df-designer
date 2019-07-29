import { applyMiddleware, createStore, DeepPartial } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import { tilesActions } from "./actions";
import { rootReducer } from "./reducers";
import { State } from "./types";

export const configureStore = (
  initialState: DeepPartial<State> | undefined,
  options: { isServer: boolean },
) => {
  const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware)),
  );
  if (module.hot) {
    module.hot.accept("./reducers", () => {
      store.replaceReducer(require("./reducers").rootReducer);
    });
  }
  if (!options.isServer) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store.dispatch<any>(tilesActions.hydrateTiles());
    store.subscribe(() => {
      const state = store.getState();
      localStorage.setItem(
        "df-designer-state",
        JSON.stringify(state.tiles.data),
      );
    });
  }

  return store;
};
