import { Dispatch, AnyAction as ReduxAnyAction, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { ActionsMap } from "@mrwolfz/react-redux-hooks-poc";

declare module "redux" {
  interface Dispatch {
    (action: ThunkAction): void;
  }
  declare type AnyAction = ThunkAction | ReduxAnyAction;
}

declare module "@mrwolfz/react-redux-hooks-poc" {
  export declare function useReduxActions<
    T extends {
      [key: string]: (...args: any) => ThunkAction | AnyAction;
    }
  >(actions: T): T;
}
