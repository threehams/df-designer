import { TilesState } from "./tiles/types";
import { ToolState } from "./tool/types";

export interface State {
  readonly tiles: TilesState;
  readonly tool: ToolState;
}
