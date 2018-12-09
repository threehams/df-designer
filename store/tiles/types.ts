import { Patch } from "immer";
import { CommandKey } from "../tool";

export type TileCommands = CommandKey[];
export interface TilesState {
  readonly data: { [key: string]: TileCommands };
  readonly patches: Patch[];
  readonly version: number;
}
