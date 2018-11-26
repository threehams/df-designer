import { Patch } from "immer";
import { Command } from "../tool";

export type Tile = Command[];
export interface TilesState {
  readonly data: { [key: string]: Tile };
  readonly patches: Patch[];
  readonly version: number;
}
