import { Patch } from "immer";
import { tilesetNames } from "../static/tilesetNames";

export type Tool = "select" | "paint" | "erase" | "rectangle";
export type CommandSlug =
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
  | "wallGrate"
  | "cabinet"
  | "container"
  | "kennel"
  | "farmPlot"
  | "weaponRack"
  | "statue"
  | "table"
  | "pavedRoad"
  | "dirtRoad"
  | "bridge"
  | "well"
  // siege engines
  | "ballista"
  | "catapult"
  // workshops
  | "leatherWorks"
  | "quern"
  | "millstone"
  | "loom"
  | "clothiersShop"
  | "bowyersWorkshop"
  | "carpentersWorkshop"
  | "metalsmithsForge"
  | "magmaForge"
  | "jewelersWorkshop"
  | "masonsWorkshop"
  | "butchersShop"
  | "tannersShop"
  | "craftsdwarfsWorkshop"
  | "siegeWorkshop"
  | "mechanicsWorkshop"
  | "still"
  | "farmersWorkshop"
  | "kitchen"
  | "fishery"
  | "ashery"
  | "dyersShop"
  | "soapMakersWorkshop"
  // furnaces
  | "woodFurnace"
  | "smelter"
  | "glassFurnace"
  | "kiln"
  | "magmaSmelter"
  | "magmaGlassFurnace"
  | "magmaKiln"
  // done
  | "glassWindow"
  | "gemWindow"
  // constructions
  | "constructWall"
  | "constructFloor"
  | "constructRamp"
  | "constructUpStair"
  | "constructDownStair"
  | "constructUpDownStair"
  | "constructFortification"
  // done
  | "tradeDepot"
  // traps/levers
  | "stoneFallTrap"
  | "weaponTrap"
  | "lever"
  | "pressurePlate"
  | "cageTrap"
  | "uprightSpearSpike"
  // machine components
  | "screwPump"
  | "waterWheel"
  | "windmill"
  | "gearAssembly"
  | "horizontalAxle"
  | "verticalAxle"
  // done
  | "support"
  | "animalTrap"
  | "restraint"
  | "cage"
  | "archeryTarget"
  | "tractionBench"
  // stockpiles
  | "animalStockpile"
  | "foodStockpile"
  | "furnitureStorageStockpile"
  | "graveyardStockpile"
  | "refuseStockpile"
  | "stoneStockpile"
  | "woodStockpile"
  | "gemStockpile"
  | "barBlockStockpile"
  | "clothStockpile"
  | "leatherStockpile"
  | "ammoStockpile"
  | "coinsStockpile"
  | "finishedGoodsStockpile"
  | "weaponsStockpile"
  | "armorStockpile";
// quickfort stockpiles

export type AdjustmentKey =
  | "makeBedroom"
  | "makeDiningRoom"
  | "seedsStockpile"
  | "noseedsStockpile"
  | "boozeStockpile"
  | "edibleFoodStockpile"
  | "plantsStockpile"
  | "corpsesStockpile"
  | "bonesStockpile"
  | "rawhidesStockpile"
  | "tannedhidesStockpile"
  | "metalStockpile"
  | "nometalStockpile"
  | "bauxiteStockpile"
  | "nobauxiteStockpile"
  | "artifactsStockpile"
  | "noartifactsStockpile"
  | "junkgoodsStockpile";

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
export type CommandMap = { [Key in CommandSlug]: Command };
export type AdjustmentMap = { [Key in AdjustmentKey]: Adjustment };
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
  slug: CommandSlug;
  height?: number;
  name: string;
  phase: PhaseSlug;
  shortcut: string;
  textures: TilesetName[];
  type: "designation" | "item";
  width?: number;
}

export interface ResizeAdjustment {
  type: "resize";
  slug: AdjustmentKey;
  name: string;
  phase: PhaseSlug;
  shortcut: string;
  requires: CommandSlug;
  initialSize: number;
}

export interface SelectAdjustment {
  type: "select";
  slug: AdjustmentKey;
  name: string;
  phase: PhaseSlug;
  shortcut: string;
  requires: CommandSlug;
  selectCommand: string;
  selectName: string;
}

export type Adjustment = SelectAdjustment | ResizeAdjustment;

export interface Phase {
  name: string;
  slug: PhaseSlug;
}

export type AdjustmentData = {
  [Key in AdjustmentKey]?: number | boolean | string;
};
export type ImportMap = { [Key in PhaseSlug]?: string };
export interface Tile {
  readonly designation: CommandSlug | null;
  readonly item: CommandSlug | null;
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
