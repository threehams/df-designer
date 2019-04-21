import memoize from "memoize-state";
import { useReduxState } from "@mrwolfz/react-redux-hooks-poc";
import { State } from "../store/types";

type UseReduxState = <TSlice = State>(
  selector?: (state: State) => TSlice,
) => TSlice;

export const useMemoizedState: UseReduxState = mapState => {
  return useReduxState(memoize(mapState));
};
