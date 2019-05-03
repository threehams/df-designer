import { State } from "../store/types";

declare module "react-redux" {
  export function useSelector<TSelected>(
    selector: (state: State) => TSelected,
    deps?: ReadonlyArray<any>,
  ): TSelected;
}

declare module "redux" {
  export interface Dispatch<A extends Action = AnyAction> {
    <T>(thunk: (dispatch: Dispatch, getState: () => any) => T): T;
  }
}
