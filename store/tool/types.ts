import { tilesetNames } from "../../lib/tilesetNames";
export type Tool = "select" | "paint" | "erase" | "rectangle";
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

interface Coordinates {
  x: number;
  y: number;
}
export type Io = "export" | "import";
export type Phase = "dig" | "designate" | "build" | "place" | "query";
type TilesetName = keyof typeof tilesetNames;
export type CommandMap = { [Key in Command]: CommandConfig };
export interface ToolState {
  readonly current: Tool;
  readonly last: Tool | null;
  readonly export: boolean;
  readonly selectionStart: Coordinates | null;
  readonly phase: Phase;
  readonly command: Command;
  readonly io: Io | null;
  readonly selectedItem: Coordinates | null;
}

interface Adjustment {
  name: string;
  shortcut: string;
  resize?: boolean;
  initialSize?: number;
  requires?: string[];
}

export interface CommandConfig {
  bitmask?: boolean;
  command: Command;
  height?: number;
  shortcut: string;
  name: string;
  phase: Phase;
  requiredTool?: Tool | null;
  textures: TilesetName[];
  width?: number;
  adjustments?: Adjustment[];
}

export interface PhaseConfig {
  name: string;
  phase: Phase;
}
