import { Patch } from "immer";

export type TileStatus = "dug" | "smoothed" | "engraved";
export type Tile = TileStatus[];
export interface TilesState {
  readonly data: { [key: string]: Tile };
  readonly patches: Patch[];
}
