import { Patch } from "immer";
import { Command } from "../tool";

export type TileCommands = Command[];
export interface TilesState {
  readonly data: { [key: string]: TileCommands };
  readonly patches: Patch[];
  readonly version: number;
}
