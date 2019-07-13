import { Patch } from "immer";
import { adjustmentMap, commandMap, phases, tilesetNames } from "../static";

export type Tool = "select" | "paint" | "erase" | "rectangle";
export type CommandSlug = keyof typeof commandMap;
export type AdjustmentKey = keyof typeof adjustmentMap;

// abbreviation prevents shadowing a global geolocation type
export interface Coords {
  x: number;
  y: number;
}
export interface SelectedCoords {
  endX: number;
  endY: number;
  startX: number;
  startY: number;
}

export type Io = "export" | "import";
export type PhaseSlug = keyof typeof phases;
export type Type = "designation" | "item";
export type CommandMap = typeof commandMap;
export type AdjustmentMap = typeof adjustmentMap;
export interface ToolState {
  readonly command: CommandSlug;
  readonly current: Tool;
  readonly dragEnd: Coords | undefined;
  readonly dragging: boolean;
  readonly dragStart: Coords | undefined;
  readonly export: boolean;
  readonly io: Io | undefined;
  readonly last: Tool | undefined;
  readonly phase: PhaseSlug;
  readonly selecting: boolean;
  readonly selectionEnd: Coords | undefined;
  readonly selectionStart: Coords | undefined;
}

type ValueOf<T> = T[keyof T];
export type Command = ValueOf<typeof commandMap>;

export interface ResizeAdjustment {
  readonly type: "resize";
  readonly slug: AdjustmentKey;
  readonly name: string;
  readonly phase: PhaseSlug;
  readonly shortcut: string;
  readonly requires: CommandSlug;
  readonly initialSize: number;
}

export interface SelectAdjustment {
  readonly type: "select";
  readonly slug: AdjustmentKey;
  readonly name: string;
  readonly phase: PhaseSlug;
  readonly shortcut: string;
  readonly requires: CommandSlug;
  readonly selectCommand: string;
  readonly selectName: string;
}

export type Adjustment = SelectAdjustment | ResizeAdjustment;

export type Phase = typeof phases;
export type AdjustmentData = {
  [Key in AdjustmentKey]?: number | boolean | string;
};
export type ImportMap = { [Key in PhaseSlug]?: string };
export interface Tile {
  readonly designation: CommandSlug | undefined;
  readonly item: CommandSlug | undefined;
  readonly adjustments: AdjustmentData;
  readonly id: string;
  // performance only, avoid creating in selectors
  readonly coordinates: Coords;
}
export interface TilesMap {
  readonly [coordinates: string]: Tile;
}
export interface ZPatch {
  zLevel: number;
  patches: Patch[];
}
export interface Update {
  id: string;
  zLevel: number;
}
export interface TilesState {
  readonly data: {
    readonly [zLevel: string]: TilesMap;
  };
  readonly transaction: Patch[];
  readonly updates: Update[];
  readonly past: ZPatch[];
  readonly future: ZPatch[];
  readonly zLevel: number;
}

export interface State {
  readonly tiles: TilesState;
  readonly tool: ToolState;
}

export interface TileSprite {
  id: string;
  textureName: keyof typeof tilesetNames;
}
export type Chunk = SelectedCoords & {
  tiles: TileSprite[];
};
