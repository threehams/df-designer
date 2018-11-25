import { tilesetNames } from "../../lib/tilesetNames";
export type Tool = "paint" | "erase" | "rectangle";
export type Command =
  | "armorStand"
  | "bed"
  | "channel"
  | "door"
  | "downStair"
  | "engrave"
  | "floodgate"
  | "floorGrate"
  | "floorHatch"
  | "fortification"
  | "mine"
  | "seat"
  | "smooth"
  | "tomb"
  | "upDownStair"
  | "upRamp"
  | "upStair"
  | "verticalBars"
  | "wallGrate";
export type Phase = "dig" | "build" | "place" | "query";
type TilesetName = keyof typeof tilesetNames;
export type CommandMap = { [Key in Command]: CommandConfig };
export interface ToolState {
  readonly current: Tool;
  readonly last: Tool | null;
  readonly export: boolean;
  readonly selectionStart: {
    x: number;
    y: number;
  } | null;
  readonly phase: Phase;
  readonly command: Command;
  readonly phases: Phase[];
  readonly commands: CommandConfig[];
}

export interface CommandConfig {
  bitmask?: boolean;
  command: Command;
  height?: number;
  key: string;
  name: string;
  phase: Phase;
  requiredCommand?: Command[];
  requiredTool?: Tool | null;
  textures: TilesetName[];
  width?: number;
}

export interface PhaseConfig {
  name: string;
  phase: Phase;
}
