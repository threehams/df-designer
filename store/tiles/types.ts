import { Patch } from "immer";
import { Command } from "../tool";

export type Tile = {
  id: string;
  commands: TileCommands;
};
export type TileCommands = Command[];
export interface TilesState {
  readonly data: { [key: string]: TileCommands };
  readonly patches: Patch[];
  readonly version: number;
}
