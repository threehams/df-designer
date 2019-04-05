import { Patch } from "immer";
import { adjustmentMap, commandMap } from "../static/commands";
import { tilesetNames } from "../static/tilesetNames";

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
type TilesetName = keyof typeof tilesetNames;

export type Io = "export" | "import";
export type PhaseSlug = "dig" | "designate" | "build" | "place" | "query";
export type Type = "designation" | "item";
export type CommandMap = typeof commandMap;
export type AdjustmentMap = typeof adjustmentMap;
export interface ToolState {
  readonly command: CommandSlug;
  readonly current: Tool;
  readonly dragEnd: Coords | null;
  readonly dragging: boolean;
  readonly dragStart: Coords | null;
  readonly export: boolean;
  readonly io: Io | null;
  readonly last: Tool | null;
  readonly phase: PhaseSlug;
  readonly selecting: boolean;
  readonly selectionEnd: Coords | null;
  readonly selectionStart: Coords | null;
}

export interface Command {
  readonly slug: CommandSlug;
  readonly height?: number;
  readonly name: string;
  readonly phase: PhaseSlug;
  readonly shortcut: string;
  readonly textures: readonly TilesetName[];
  readonly type: "designation" | "item";
  readonly width?: number;
}

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

export interface Phase {
  name: string;
  slug: PhaseSlug;
}

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
export interface TilesMap {
  readonly [coordinates: string]: Tile;
}
export interface ZPatch {
  zLevel: number;
  patches: Patch[];
}
export interface TilesState {
  readonly data: {
    readonly [zLevel: string]: TilesMap;
  };
  readonly transaction: Patch[];
  readonly updates: string[];
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
