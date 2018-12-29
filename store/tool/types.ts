import { tilesetNames } from "../../lib/tilesetNames";
export type Tool = "select" | "paint" | "erase" | "rectangle";
export type CommandKey =
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
  | "armorStockpile"
  // quickfort stockpiles
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

export interface Coordinates {
  x: number;
  y: number;
}
type TilesetName = keyof typeof tilesetNames;

export type Io = "export" | "import";
export type Phase = "dig" | "designate" | "build" | "place" | "query";
export type Type = "designation" | "item";
export type CommandMap = { [Key in CommandKey]: Command };
export interface ToolState {
  readonly command: CommandKey;
  readonly current: Tool;
  readonly dragEnd: Coordinates | null;
  readonly dragging: boolean;
  readonly dragStart: Coordinates | null;
  readonly export: boolean;
  readonly io: Io | null;
  readonly last: Tool | null;
  readonly phase: Phase;
  readonly selecting: boolean;
  readonly selectionEnd: Coordinates | null;
  readonly selectionStart: Coordinates | null;
}

interface ResizeAdjustment {
  type: "resize";
  name: string;
  initialValue: number;
  increment: string;
  decrement: string;
}
interface ToggleAdjustment {
  type: "toggle";
  name: string;
  initialValue: boolean;
  shortcut: string;
}
export type Adjustment = ToggleAdjustment | ResizeAdjustment;

export interface Command {
  adjustments?: Adjustment[];
  bitmask?: boolean;
  command: CommandKey;
  height?: number;
  name: string;
  phase: Phase;
  requiredTool?: Tool | null;
  shortcut: string;
  textures: TilesetName[];
  type: Type;
  width?: number;
}

export interface PhaseConfig {
  name: string;
  phase: Phase;
}
