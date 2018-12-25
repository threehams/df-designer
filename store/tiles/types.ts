import { Patch } from "immer";
import { CommandKey } from "../tool";

export interface Tile {
  readonly designation: CommandKey | null;
  readonly item: CommandKey | null;
  readonly adjustments: { [key: string]: boolean | number };
  readonly id: string;
}
export interface TilesState {
  readonly data: {
    readonly [key: string]: Tile;
  };
  readonly transaction: Patch[];
  readonly updates: string[];
  readonly past: Patch[][];
  readonly future: Patch[][];
}
