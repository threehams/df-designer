import { AdjustmentMap, CommandMap } from "./types";

export const commands: CommandMap = {
  mine: {
    name: "Mine",
    slug: "mine",
    shortcut: "d",
    phase: "dig",
    type: "designation",
    textures: ["plus"],
  },
  channel: {
    name: "Channel",
    slug: "channel",
    shortcut: "h",
    phase: "dig",
    type: "designation",
    textures: ["underscore"],
  },
  upStair: {
    name: "Up Stair",
    slug: "upStair",
    shortcut: "u",
    phase: "dig",
    type: "designation",
    textures: ["stairsUp"],
  },
  upDownStair: {
    name: "Up/Down Stair",
    slug: "upDownStair",
    shortcut: "i",
    phase: "dig",
    type: "designation",
    textures: ["X"],
  },
  downStair: {
    name: "Down Stair",
    slug: "downStair",
    shortcut: "j",
    phase: "dig",
    type: "designation",
    textures: ["stairsDown"],
  },
  upRamp: {
    name: "Up Ramp",
    slug: "upRamp",
    shortcut: "u",
    phase: "dig",
    type: "designation",
    textures: ["rampUp"],
  },
  fortification: {
    name: "Carve Fortifications",
    slug: "fortification",
    textures: ["smoothWallCross"],
    shortcut: "F",
    phase: "designate",
    type: "designation",
  },
  smooth: {
    name: "Smooth Stone",
    slug: "smooth",
    shortcut: "s",
    phase: "designate",
    type: "designation",
    textures: ["plus"],
  },
  engrave: {
    name: "Engrave Stone",
    slug: "engrave",
    shortcut: "e",
    phase: "designate",
    type: "designation",
    textures: ["smoothWallCross"],
  },
  armorStand: {
    name: "Armor Stand",
    slug: "armorStand",
    shortcut: "a",
    phase: "build",
    type: "item",
    textures: ["armorStand"],
  },
  bed: {
    name: "Bed",
    slug: "bed",
    shortcut: "b",
    phase: "build",
    type: "item",
    textures: ["bed"],
  },
  seat: {
    name: "Seat",
    slug: "seat",
    shortcut: "c",
    phase: "build",
    type: "item",
    textures: ["chair"],
  },
  tomb: {
    name: "Burial Receptacle",
    slug: "tomb",
    shortcut: "n",
    phase: "build",
    type: "item",
    textures: ["tomb"],
  },
  door: {
    name: "Door",
    slug: "door",
    shortcut: "d",
    phase: "build",
    type: "item",
    textures: ["door"],
  },
  floodgate: {
    name: "Floodgate",
    slug: "floodgate",
    shortcut: "x",
    phase: "build",
    type: "item",
    textures: ["floodgate"],
  },
  floorHatch: {
    name: "Floor Hatch",
    slug: "floorHatch",
    shortcut: "H",
    phase: "build",
    type: "item",
    textures: ["hatch"],
  },
  floorGrate: {
    name: "Floor Grate",
    slug: "floorGrate",
    shortcut: "G",
    phase: "build",
    type: "item",
    textures: ["grate"],
  },
  verticalBars: {
    name: "Vertical Bars",
    slug: "verticalBars",
    shortcut: "B",
    phase: "build",
    type: "item",
    textures: ["bar"],
  },
  wallGrate: {
    name: "Wall Grate",
    slug: "wallGrate",
    shortcut: "W",
    phase: "build",
    type: "item",
    textures: ["floodgate"],
  },
  cabinet: {
    name: "Cabinet",
    slug: "cabinet",
    shortcut: "f",
    phase: "build",
    type: "item",
    textures: ["cabinet"],
  },
  container: {
    name: "Container",
    slug: "container",
    shortcut: "h",
    phase: "build",
    type: "item",
    textures: ["coffer"],
  },
  kennel: {
    name: "Kennels",
    slug: "kennel",
    shortcut: "k",
    phase: "build",
    type: "item",
    textures: ["earring"],
  },
  farmPlot: {
    name: "Farm Plot",
    slug: "farmPlot",
    shortcut: "p",
    phase: "build",
    type: "item",
    textures: ["roadRough"],
  },
  weaponRack: {
    name: "Weapon Rack",
    slug: "weaponRack",
    shortcut: "r",
    phase: "build",
    type: "item",
    textures: ["weaponRack"],
  },
  statue: {
    name: "Statue",
    slug: "statue",
    shortcut: "s",
    phase: "build",
    type: "item",
    textures: ["statue"],
  },
  table: {
    name: "Table",
    slug: "table",
    shortcut: "t",
    phase: "build",
    type: "item",
    textures: ["table"],
  },
  pavedRoad: {
    name: "Paved Road",
    slug: "pavedRoad",
    shortcut: "o",
    phase: "build",
    type: "item",
    textures: ["plus"],
  },
  dirtRoad: {
    name: "Dirt Road",
    slug: "dirtRoad",
    shortcut: "O",
    phase: "build",
    type: "item",
    textures: ["roadRough"],
  },
  bridge: {
    name: "Bridge",
    slug: "bridge",
    shortcut: "g",
    phase: "build",
    type: "item",
    textures: ["plus"],
  },
  well: {
    name: "Well",
    slug: "well",
    shortcut: "l",
    phase: "build",
    type: "item",
    textures: ["well"],
  },
  ballista: {
    name: "Ballista",
    slug: "ballista",
    shortcut: "ib",
    phase: "build",
    type: "item",
    // this is going to be rough
    textures: ["bowyer"],
  },
  catapult: {
    name: "Catapult",
    slug: "catapult",
    shortcut: "ic",
    phase: "build",
    type: "item",
    // ditto
    textures: ["bowyer"],
  },
  leatherWorks: {
    name: "Leather Works",
    slug: "leatherWorks",
    shortcut: "we",
    phase: "build",
    type: "item",
    textures: ["W"],
    width: 3,
    height: 3,
  },
  quern: {
    name: "Quern",
    slug: "quern",
    shortcut: "wq",
    phase: "build",
    type: "item",
    textures: ["W"],
  },
  millstone: {
    name: "Millstone",
    slug: "millstone",
    shortcut: "wM",
    phase: "build",
    type: "item",
    textures: ["W"],
  },
  loom: {
    name: "Loom",
    slug: "loom",
    shortcut: "wo",
    phase: "build",
    type: "item",
    textures: ["W"],
    width: 3,
    height: 3,
  },
  clothiersShop: {
    name: "Clothier's Shop",
    slug: "clothiersShop",
    shortcut: "wk",
    phase: "build",
    type: "item",
    textures: ["W"],
    width: 3,
    height: 3,
  },
  bowyersWorkshop: {
    name: "Bowyer's Workshop",
    slug: "bowyersWorkshop",
    shortcut: "wb",
    phase: "build",
    type: "item",
    textures: ["W"],
    width: 3,
    height: 3,
  },
  carpentersWorkshop: {
    name: "Carpenter's Workshop",
    slug: "carpentersWorkshop",
    shortcut: "wc",
    phase: "build",
    type: "item",
    textures: ["W"],
    width: 3,
    height: 3,
  },
  metalsmithsForge: {
    name: "Metalsmith's Forge",
    slug: "metalsmithsForge",
    shortcut: "wf",
    phase: "build",
    type: "item",
    textures: ["W"],
    width: 3,
    height: 3,
  },
  magmaForge: {
    name: "Magma Forge",
    slug: "magmaForge",
    shortcut: "wv",
    phase: "build",
    type: "item",
    textures: ["W"],
    width: 3,
    height: 3,
  },
  jewelersWorkshop: {
    name: "Jeweler's Workshop",
    slug: "jewelersWorkshop",
    shortcut: "wj",
    phase: "build",
    type: "item",
    textures: ["W"],
    width: 3,
    height: 3,
  },
  masonsWorkshop: {
    name: "Mason's Workshop",
    slug: "masonsWorkshop",
    shortcut: "wm",
    phase: "build",
    type: "item",
    textures: ["W"],
    width: 3,
    height: 3,
  },
  butchersShop: {
    name: "Butcher's Shop",
    slug: "butchersShop",
    shortcut: "wu",
    phase: "build",
    type: "item",
    textures: ["W"],
    width: 3,
    height: 3,
  },
  tannersShop: {
    name: "Tanner's Shop",
    slug: "tannersShop",
    shortcut: "wn",
    phase: "build",
    type: "item",
    textures: ["W"],
    width: 3,
    height: 3,
  },
  craftsdwarfsWorkshop: {
    name: "Craftdwarf's Workshop",
    slug: "craftsdwarfsWorkshop",
    shortcut: "wr",
    phase: "build",
    type: "item",
    textures: ["W"],
    width: 3,
    height: 3,
  },
  siegeWorkshop: {
    name: "Siege Workshop",
    slug: "siegeWorkshop",
    shortcut: "ws",
    phase: "build",
    type: "item",
    textures: ["W"],
    width: 5,
    height: 5,
  },
  mechanicsWorkshop: {
    name: "Mechanic's Workshop",
    slug: "mechanicsWorkshop",
    shortcut: "wt",
    phase: "build",
    type: "item",
    textures: ["W"],
    width: 3,
    height: 3,
  },
  still: {
    name: "Still",
    slug: "still",
    shortcut: "wl",
    phase: "build",
    type: "item",
    textures: ["W"],
    width: 3,
    height: 3,
  },
  farmersWorkshop: {
    name: "Farmer's Workshop",
    slug: "farmersWorkshop",
    shortcut: "ww",
    phase: "build",
    type: "item",
    textures: ["W"],
    width: 3,
    height: 3,
  },
  kitchen: {
    name: "Kitchen",
    slug: "kitchen",
    shortcut: "wz",
    phase: "build",
    type: "item",
    textures: ["W"],
    width: 3,
    height: 3,
  },
  fishery: {
    name: "Fishery",
    slug: "fishery",
    shortcut: "wh",
    phase: "build",
    type: "item",
    textures: ["W"],
    width: 3,
    height: 3,
  },
  ashery: {
    name: "ashery",
    slug: "ashery",
    shortcut: "wy",
    phase: "build",
    type: "item",
    textures: ["W"],
    width: 3,
    height: 3,
  },
  dyersShop: {
    name: "Dyer's Shop",
    slug: "dyersShop",
    shortcut: "wd",
    phase: "build",
    type: "item",
    textures: ["W"],
    width: 3,
    height: 3,
  },
  soapMakersWorkshop: {
    name: "Soap Maker's Workshop",
    slug: "soapMakersWorkshop",
    shortcut: "wS",
    phase: "build",
    type: "item",
    textures: ["W"],
    width: 3,
    height: 3,
  },
  woodFurnace: {
    name: "Wood Furnace",
    slug: "woodFurnace",
    shortcut: "ew",
    phase: "build",
    type: "item",
    textures: ["e"],
    width: 3,
    height: 3,
  },
  smelter: {
    name: "Smelter",
    slug: "smelter",
    shortcut: "es",
    phase: "build",
    type: "item",
    textures: ["e"],
    width: 3,
    height: 3,
  },
  glassFurnace: {
    name: "Glass Furnace",
    slug: "glassFurnace",
    shortcut: "eg",
    phase: "build",
    type: "item",
    textures: ["e"],
    width: 3,
    height: 3,
  },
  kiln: {
    name: "Kiln",
    slug: "kiln",
    shortcut: "ek",
    phase: "build",
    type: "item",
    textures: ["e"],
    width: 3,
    height: 3,
  },
  magmaSmelter: {
    name: "Magma Smelter",
    slug: "magmaSmelter",
    shortcut: "el",
    phase: "build",
    type: "item",
    textures: ["e"],
    width: 3,
    height: 3,
  },
  magmaGlassFurnace: {
    name: "Magma Glass Furnace",
    slug: "magmaGlassFurnace",
    shortcut: "ea",
    phase: "build",
    type: "item",
    textures: ["e"],
    width: 3,
    height: 3,
  },
  magmaKiln: {
    name: "Magma Kiln",
    slug: "magmaKiln",
    shortcut: "en",
    phase: "build",
    type: "item",
    textures: ["e"],
    width: 3,
    height: 3,
  },
  glassWindow: {
    name: "Glass Window",
    slug: "glassWindow",
    shortcut: "",
    phase: "build",
    type: "item",
    textures: ["y"],
  },
  gemWindow: {
    name: "Gem Window",
    slug: "gemWindow",
    shortcut: "",
    phase: "build",
    type: "item",
    textures: ["Y"],
  },
  constructWall: {
    name: "Wall",
    slug: "constructWall",
    shortcut: "Cw",
    phase: "build",
    type: "item",
    textures: ["O"],
  },
  constructFloor: {
    name: "Floor",
    slug: "constructFloor",
    shortcut: "Cf",
    phase: "build",
    type: "item",
    textures: ["plus"],
  },
  constructRamp: {
    name: "Ramp",
    slug: "constructRamp",
    shortcut: "Cr",
    phase: "build",
    type: "item",
    textures: ["rampUp"],
  },
  constructUpStair: {
    name: "Up Stair",
    slug: "constructUpStair",
    shortcut: "Cu",
    phase: "build",
    type: "item",
    textures: ["stairsUp"],
  },
  constructDownStair: {
    name: "Down Stair",
    slug: "constructDownStair",
    shortcut: "Cj",
    phase: "build",
    type: "item",
    textures: ["stairsDown"],
  },
  constructUpDownStair: {
    name: "Up / Down Stair",
    slug: "constructUpDownStair",
    shortcut: "Cx",
    phase: "build",
    type: "item",
    textures: ["X"],
  },
  constructFortification: {
    name: "Fortification",
    slug: "constructFortification",
    shortcut: "CF",
    phase: "build",
    type: "item",
    textures: ["smoothWallCross"],
  },
  tradeDepot: {
    name: "Trade Depot",
    slug: "tradeDepot",
    shortcut: "D",
    phase: "build",
    type: "item",
    textures: ["D"],
    width: 5,
    height: 5,
  },
  stoneFallTrap: {
    name: "Stone-Fall Trap",
    slug: "stoneFallTrap",
    shortcut: "Ts",
    phase: "build",
    type: "item",
    textures: ["caret"],
  },
  weaponTrap: {
    name: "Weapon Trap",
    slug: "weaponTrap",
    shortcut: "Tw",
    phase: "build",
    type: "item",
    textures: ["caret"],
  },
  lever: {
    name: "Lever",
    slug: "lever",
    shortcut: "Tl",
    phase: "build",
    type: "item",
    textures: ["leverOff"],
  },
  pressurePlate: {
    name: "Pressure Plate",
    slug: "pressurePlate",
    shortcut: "Tp",
    phase: "build",
    type: "item",
    textures: ["caret"],
  },
  cageTrap: {
    name: "Cage Trap",
    slug: "cageTrap",
    shortcut: "Tc",
    phase: "build",
    type: "item",
    textures: ["caret"],
  },
  uprightSpearSpike: {
    name: "Upright Spear/Spike",
    slug: "uprightSpearSpike",
    shortcut: "TS",
    phase: "build",
    type: "item",
    textures: ["riverVertical"],
  },
  screwPump: {
    name: "Screw Pump",
    slug: "screwPump",
    shortcut: "Ms",
    phase: "build",
    type: "item",
    textures: ["S"],
  },
  waterWheel: {
    name: "Water Wheel",
    slug: "waterWheel",
    shortcut: "Mw",
    phase: "build",
    type: "item",
    textures: ["w"],
  },
  windmill: {
    name: "Windmill",
    slug: "windmill",
    shortcut: "Mm",
    phase: "build",
    type: "item",
    textures: ["W"],
  },
  gearAssembly: {
    name: "Gear Assembly",
    slug: "gearAssembly",
    shortcut: "Mg",
    phase: "build",
    type: "item",
    textures: ["splat"],
  },
  horizontalAxle: {
    name: "Horizontal Axle",
    slug: "horizontalAxle",
    shortcut: "Mh",
    phase: "build",
    type: "item",
    textures: ["riverVertical"],
  },
  verticalAxle: {
    name: "Vertical Axle",
    slug: "verticalAxle",
    shortcut: "Mv",
    phase: "build",
    type: "item",
    textures: ["o"],
  },
  support: {
    name: "Support",
    slug: "support",
    shortcut: "S",
    phase: "build",
    type: "item",
    textures: ["I"],
  },
  animalTrap: {
    name: "Animal Trap",
    slug: "animalTrap",
    shortcut: "m",
    phase: "build",
    type: "item",
    textures: ["animalTrap"],
  },
  restraint: {
    name: "Restraint",
    slug: "restraint",
    shortcut: "v",
    phase: "build",
    type: "item",
    textures: ["restraint"],
  },
  cage: {
    name: "Cage",
    slug: "cage",
    shortcut: "j",
    phase: "build",
    type: "item",
    textures: ["cage"],
  },
  archeryTarget: {
    name: "Archery Target",
    slug: "archeryTarget",
    shortcut: "A",
    phase: "build",
    type: "item",
    textures: ["X"],
  },
  tractionBench: {
    name: "Traction Bench",
    slug: "tractionBench",
    shortcut: "R",
    phase: "build",
    type: "item",
    textures: ["T"],
  },
  animalStockpile: {
    name: "Animal Stockpile",
    slug: "animalStockpile",
    shortcut: "a",
    phase: "place",
    type: "item",
    textures: ["stockpileEmpty"],
  },
  foodStockpile: {
    name: "Food Stockpile",
    slug: "foodStockpile",
    shortcut: "f",
    phase: "place",
    type: "item",
    textures: ["stockpileEmpty"],
  },
  furnitureStorageStockpile: {
    name: "Furniture Storage Stockpile",
    slug: "furnitureStorageStockpile",
    shortcut: "u",
    phase: "place",
    type: "item",
    textures: ["stockpileEmpty"],
  },
  graveyardStockpile: {
    name: "Graveyard Stockpile",
    slug: "graveyardStockpile",
    shortcut: "y",
    phase: "place",
    type: "item",
    textures: ["stockpileEmpty"],
  },
  refuseStockpile: {
    name: "Refuse Stockpile",
    slug: "refuseStockpile",
    shortcut: "r",
    phase: "place",
    type: "item",
    textures: ["stockpileEmpty"],
  },
  stoneStockpile: {
    name: "Stone Stockpile",
    slug: "stoneStockpile",
    shortcut: "s",
    phase: "place",
    type: "item",
    textures: ["stockpileEmpty"],
  },
  woodStockpile: {
    name: "Wood Stockpile",
    slug: "woodStockpile",
    shortcut: "w",
    phase: "place",
    type: "item",
    textures: ["stockpileEmpty"],
  },
  gemStockpile: {
    name: "Gem Stockpile",
    slug: "gemStockpile",
    shortcut: "e",
    phase: "place",
    type: "item",
    textures: ["stockpileEmpty"],
  },
  barBlockStockpile: {
    name: "Bar/Block Stockpile",
    slug: "barBlockStockpile",
    shortcut: "b",
    phase: "place",
    type: "item",
    textures: ["stockpileEmpty"],
  },
  clothStockpile: {
    name: "Cloth Stockpile",
    slug: "clothStockpile",
    shortcut: "h",
    phase: "place",
    type: "item",
    textures: ["stockpileEmpty"],
  },
  leatherStockpile: {
    name: "Leather Stockpile",
    slug: "leatherStockpile",
    shortcut: "l",
    phase: "place",
    type: "item",
    textures: ["stockpileEmpty"],
  },
  ammoStockpile: {
    name: "Ammo Stockpile",
    slug: "ammoStockpile",
    shortcut: "z",
    phase: "place",
    type: "item",
    textures: ["stockpileEmpty"],
  },
  coinsStockpile: {
    name: "Coins Stockpile",
    slug: "coinsStockpile",
    shortcut: "n",
    phase: "place",
    type: "item",
    textures: ["stockpileEmpty"],
  },
  finishedGoodsStockpile: {
    name: "Finished Goods Stockpile",
    slug: "finishedGoodsStockpile",
    shortcut: "g",
    phase: "place",
    type: "item",
    textures: ["stockpileEmpty"],
  },
  weaponsStockpile: {
    name: "Weapons Stockpile",
    slug: "weaponsStockpile",
    shortcut: "p",
    phase: "place",
    type: "item",
    textures: ["stockpileEmpty"],
  },
  armorStockpile: {
    name: "Armor Stockpile",
    slug: "armorStockpile",
    shortcut: "d",
    phase: "place",
    type: "item",
    textures: ["stockpileEmpty"],
  },
};

export const adjustments: AdjustmentMap = {
  makeBedroom: {
    name: "Make Bedroom",
    slug: "makeBedroom",
    shortcut: "r",
    phase: "query",
    type: "resize",
    requires: "bed",
    initialSize: 3,
  },
  makeDiningRoom: {
    name: "Make Dining Room",
    slug: "makeDiningRoom",
    shortcut: "r",
    phase: "query",
    type: "resize",
    requires: "table",
    initialSize: 3,
  },
  seedsStockpile: {
    name: "Seeds Stockpile",
    slug: "seedsStockpile",
    shortcut: "seeds",
    phase: "query",
    type: "select",
    requires: "foodStockpile",
    selectCommand: "stockpile",
    selectName: "Stockpile Type",
  },
  noseedsStockpile: {
    name: "No Seeds Stockpile",
    slug: "noseedsStockpile",
    shortcut: "noseeds",
    phase: "query",
    type: "select",
    requires: "foodStockpile",
    selectCommand: "stockpile",
    selectName: "Stockpile Type",
  },
  boozeStockpile: {
    name: "Booze Stockpile",
    slug: "boozeStockpile",
    shortcut: "booze",
    phase: "query",
    type: "select",
    requires: "foodStockpile",
    selectCommand: "stockpile",
    selectName: "Stockpile Type",
  },
  edibleFoodStockpile: {
    name: "Food Stockpile",
    slug: "edibleFoodStockpile",
    shortcut: "food",
    phase: "query",
    type: "select",
    requires: "foodStockpile",
    selectCommand: "stockpile",
    selectName: "Stockpile Type",
  },
  plantsStockpile: {
    name: "Plants Stockpile",
    slug: "plantsStockpile",
    shortcut: "plants",
    phase: "query",
    type: "select",
    requires: "foodStockpile",
    selectCommand: "stockpile",
    selectName: "Stockpile Type",
  },
  corpsesStockpile: {
    name: "Corpses Stockpile",
    slug: "corpsesStockpile",
    shortcut: "corpses",
    phase: "query",
    type: "select",
    requires: "refuseStockpile",
    selectCommand: "stockpile",
    selectName: "Stockpile Type",
  },
  bonesStockpile: {
    name: "Bones Stockpile",
    slug: "bonesStockpile",
    shortcut: "bones",
    phase: "query",
    type: "select",
    requires: "refuseStockpile",
    selectCommand: "stockpile",
    selectName: "Stockpile Type",
  },
  rawhidesStockpile: {
    name: "Raw Hides Stockpile",
    slug: "rawhidesStockpile",
    shortcut: "rawhides",
    phase: "query",
    type: "select",
    requires: "refuseStockpile",
    selectCommand: "stockpile",
    selectName: "Stockpile Type",
  },
  tannedhidesStockpile: {
    name: "Tanned Hides Stockpile",
    slug: "tannedhidesStockpile",
    shortcut: "tannedhides",
    phase: "query",
    type: "select",
    requires: "refuseStockpile",
    selectCommand: "stockpile",
    selectName: "Stockpile Type",
  },
  metalStockpile: {
    name: "Metal Stockpile",
    slug: "metalStockpile",
    shortcut: "metal",
    phase: "query",
    type: "select",
    requires: "stoneStockpile",
    selectCommand: "stockpile",
    selectName: "Stockpile Type",
  },
  nometalStockpile: {
    name: "No Metal Stockpile",
    slug: "nometalStockpile",
    shortcut: "nometal",
    phase: "query",
    type: "select",
    requires: "stoneStockpile",
    selectCommand: "stockpile",
    selectName: "Stockpile Type",
  },
  bauxiteStockpile: {
    name: "Bauxite Stockpile",
    slug: "bauxiteStockpile",
    shortcut: "bauxite",
    phase: "query",
    type: "select",
    requires: "stoneStockpile",
    selectCommand: "stockpile",
    selectName: "Stockpile Type",
  },
  nobauxiteStockpile: {
    name: "No Bauxite Stockpile",
    slug: "nobauxiteStockpile",
    shortcut: "nobauxite",
    phase: "query",
    type: "select",
    requires: "stoneStockpile",
    selectCommand: "stockpile",
    selectName: "Stockpile Type",
  },
  artifactsStockpile: {
    name: "Artifacts Stockpile",
    slug: "artifactsStockpile",
    shortcut: "artifacts",
    phase: "query",
    type: "select",
    requires: "finishedGoodsStockpile",
    selectCommand: "stockpile",
    selectName: "Stockpile Type",
  },
  noartifactsStockpile: {
    name: "No Artifacts Stockpile",
    slug: "noartifactsStockpile",
    shortcut: "noartifacts",
    phase: "query",
    type: "select",
    requires: "finishedGoodsStockpile",
    selectCommand: "stockpile",
    selectName: "Stockpile Type",
  },
  junkgoodsStockpile: {
    name: "Junk Goods Stockpile",
    slug: "junkgoodsStockpile",
    shortcut: "junkgoods",
    phase: "query",
    type: "select",
    requires: "finishedGoodsStockpile",
    selectCommand: "stockpile",
    selectName: "Stockpile Type",
  },
};
