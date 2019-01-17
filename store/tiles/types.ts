import { Patch } from "immer";
import {
  AdjustmentKey,
  AdjustmentMap,
  CommandKey,
  Phase,
  ResizeAdjustment,
  SelectAdjustment,
} from "../tool";

export type AdjustmentData = {
  [Key in AdjustmentKey]?: AdjustmentMap[Key] extends { type: "resize" }
    ? number
    : boolean
};
export type ImportMap = { [Key in Phase]?: string };
export interface Tile {
  readonly designation: CommandKey | null;
  readonly item: CommandKey | null;
  readonly adjustments: AdjustmentData;
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
  readonly zLevel: number;
}
