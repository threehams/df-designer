import { Patch } from "immer";
import { CommandKey } from "../tool";

export interface Tile {
  readonly designation: CommandKey | null;
  readonly item: CommandKey | null;
  readonly adjustments: { [key: string]: boolean | number };
}
export interface TilesState {
  readonly data: {
    readonly [key: string]: Tile | null;
  };
  readonly patches: Patch[];
  readonly version: number;
}
