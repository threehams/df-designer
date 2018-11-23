export type TileStatus = "undug" | "dug" | "smoothed" | "engraved";
export interface Tile {
  x: number;
  y: number;
  status: TileStatus;
}
export interface TilesState {
  readonly width: number;
  readonly height: number;
  readonly selecting: boolean;
  readonly dug: Set<string>;
}
