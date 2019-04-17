import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";

declare module "redux" {
  interface Dispatch {
    (action: ThunkAction): void;
  }
}
