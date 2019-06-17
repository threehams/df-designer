import memoize from "memoize-state";
import { useSelector } from "react-redux";
import { State } from "../store/types";

type UseSelector = <TSelected>(
  selector: (state: State) => TSelected,
) => TSelected;

export const useMemoizedState: UseSelector = mapState => {
  return useSelector(memoize(mapState));
};
