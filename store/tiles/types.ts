import { Patch } from "immer";
import { CommandKey } from "../tool";

export interface Tile {
  readonly designation: CommandKey | null;
  readonly item: CommandKey | null;
  readonly adjustments: AdjustmentData[] | null;
}
interface AdjustmentData {
  name: string;
  value: any; // things get rough here
}
export interface TilesState {
  readonly data: {
    readonly [key: string]: Tile | null;
  };
  readonly patches: Patch[];
  readonly version: number;
}
