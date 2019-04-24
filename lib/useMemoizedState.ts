import memoize from "memoize-state";
import { useSelector } from "react-redux";
import { State } from "../store/types";

type UseSelector = <TSelected>(
  selector: (state: State) => TSelected,
  deps?: ReadonlyArray<any>,
) => TSelected;

export const useMemoizedState: UseSelector = (mapState, deps) => {
  return useSelector(memoize(mapState), deps);
};
