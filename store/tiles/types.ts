import { Patch } from "immer";
import { AdjustmentKey, CommandSlug, PhaseSlug } from "../tool";

export type AdjustmentData = {
  [Key in AdjustmentKey]?: number | boolean | string
};
export type ImportMap = { [Key in PhaseSlug]?: string };
export interface Tile {
  readonly designation: CommandSlug | null;
  readonly item: CommandSlug | null;
  readonly adjustments: AdjustmentData;
  readonly id: string;
}
export type TilesMap = {
  readonly [coordinates: string]: Tile;
};
export interface TilesState {
  readonly data: {
    readonly [zLevel: string]: TilesMap;
  };
  readonly transaction: Patch[];
  readonly updates: string[];
  readonly past: Patch[][];
  readonly future: Patch[][];
  readonly zLevel: number;
}
