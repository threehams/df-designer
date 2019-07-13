import { State } from "../store/types";

declare module "react-redux" {
  export function useSelector<TSelected>(
    selector: (state: State) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean,
  ): TSelected;
}
