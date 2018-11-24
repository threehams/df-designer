export const tilesetNames = [
  // 000-015
  "background", // Used for background tiles in the intro CMV and background tiles of interface screens
  "dwarfCivilian", // Civilian dwarves, various status indicators
  "dwarfMilitary", // Military dwarves
  "dimpleCup", // Dimple cups
  "cutGem", // Cut gems, large gems
  "bush", // Quarry bush leaves*, blossoms*, various forest trees*
  "tree", // Broadleaf forest, various forest trees*, various leaf items*, Plump helmets*
  "stone", // Mined-out stone*, solid workshop tile for several workshops like the magma smelter, river sources on world map, caves on world map, lairs on world map, moon on travel map, flower buds*
  "solidTile", // Solid workshop tile for several other workshops like the magma forge, tanner's shop, catapult cup, fortress keeps on travel map, nest box tool*, nest box building, book
  "well", // Well, vermin colony, millstone, quern, vertical axle, fortress walls on travel map, sun behind clouds on travel map, fortresses on world map, creeping eye out of view (adventure mode)*, staring eyeball*, bubble bulb*
  "trunkInterior", // trunk interior$
  "bag", // Male sign, bags, Various Cephalopods#
  "amulet", // Female sign, amulet
  "musicNote", // Ladles*, dancers dancing
  "armorStand", // Armor stands, playing instruments
  "roughGem", // Masterpiece quality tags, unmined gem cluster*, Rough gems and Raw glass, unmined bituminous coal*, mined bituminous coal*, currency symbol, spider webs, pond turtle*, sun, gear assemblies, paralyzed indicator, fireballs, bandit camps on travel map, towns on world map, night creature senses, artifact gem doors
  // Row 02 (016-031)
  "arrowEast", // 016 ► Head of Ballista arrow facing east, manta ray#
  "arrowWest", // 017 ◄ Head of Ballista arrow facing west
  "arrowUpDown", // 018 ↕
  "cage", // 019 ‼ Cages, on - fire tags, vertical bars
  "mug", // 020 ¶ Mugs, drinking in -progress, largest forest retreats, cumulonimbus clouds on travel map, Highwood forests *
  "restraint", // 021 § Restraints, whip vine *
  "log", // 022 ▬ Logs, hive tool * , hive building
  "cedarTree", // 023 ↨ Cedar forest *
  "arrowUp", // 024 ↑ Interface text (bridge direction), conifer forests, various forest trees *
  "arrowDown", // 025 ↓ Interface text (bridge direction), Various status indicators
  "arrowRight", // 026 → Interface text (bridge direction)
  "arrowLeft", // 027 ← Interface text (bridge direction)
  "l", // 028 ∟
  "arrowLeftRight", // 029 ↔
  "rampUp", // 030 ▲ Head of Ballista arrow facing north, ramp, track ramp up$, mountain on world map
  "rampDown", // 031 ▼ Head of Ballista arrow facing south, ramp on level below, trackramp on level below$
  // Row 03 (032-047)
  "space", // Spaces in text messages, Unexplored underground, black background on the title screen and interface menu
  "bang", // 033 ! Text, various status icons, sound indicator in sneaking mode, tracks (footprints) in sneaking mode
  "quote", // 034 " Text, shrub*, various status icons, quotation marks, Carpenter's workshop tile, kobold out of view*, goblin out of view*, blizzard man out of view*, tracks (bent vegetation) in sneaking mode, various stones*, savanna, swamp, shrubland, marsh
  "grate", // 035 # Text, floor grates, various stones*, smoothed branches in elven forest retreats, labyrinths on travel map, towns on world map
  "coin", // 036 $ Coins
  "preparedMeal", // 037 % Prepared meal, unexplored underground, screw pump in action, footprints in sneaking mode, various fruits*, various buds*, various stones*, Bismuthinite*, Floating guts#
  "demon", // 038 & Demons#
  "floorRough1", // 039 ' Text, rough floors, unexplored underground, various stones, one eyed creatures with GLOWTILE " (kobold, goblins, and blizzard in vanilla), various grasses*
  "parenLeft", // 040 ( Text, foreign object opening tag, tile in bowyer's workshop, waxing moon on travel map
  "parenRight", // 041 ) Text, foreign object closing tag, waning moon on travel map
  "splat", // 042 * Interface text, superior quality tags, Unmined ore*, glowing pits, key reference, working gear assembly, gem floodgate, various stones*, chestnut fruit*, other fruits and flowers*, moving armies on quick travel map, towns on world map
  "plus", // 043 + Text, finely-crafted quality tags, Smooth/constructed floors, block/bar bridge or road, Bauxite*, injury indicator, towns on world map, mining designation
  "floorRough2", // 044 , Text, rough floors, Claystone*, unexplored underground, various grasses*
  "dash", // 045 - Text, well-crafted quality tags, Scepters, keyboard reference, various stones*, overlapping creatures animation
  "floorRough3", // 046 . Text, rough floors, various stones*, unexplored underground, various grasses*
  "slash", // 047 / Text, weapons, bolts, Ballista tile, Pestle, overlapping creatures animation, stone axev0.43.01, active windmill blade
  // Row 04 (048-063)
  "coffin", // 048 0 Text, coffins, tombs on world map
  "1", // 049 1 Text, designation priorities, adventurer mode conversation targets, fluids if SHOW_FLOW_AMOUNTS is YES in d_init.txt
  "2", // 050 2 Text, designation priorities, adventurer mode conversation targets, fluids if SHOW_FLOW_AMOUNTS is YES in d_init.txt
  "3", // 051 3 Text, designation priorities, adventurer mode conversation targets, fluids if SHOW_FLOW_AMOUNTS is YES in d_init.txt
  "4", // 052 4 Text, designation priorities, adventurer mode conversation targets, fluids if SHOW_FLOW_AMOUNTS is YES in d_init.txt
  "5", // 053 5 Text, designation priorities, adventurer mode conversation targets, fluids if SHOW_FLOW_AMOUNTS is YES in d_init.txt
  "6", // 054 6 Text, designation priorities, adventurer mode conversation targets, fluids if SHOW_FLOW_AMOUNTS is YES in d_init.txt
  "7", // 055 7 Text, designation priorities, adventurer mode conversation targets, fluids if SHOW_FLOW_AMOUNTS is YES in d_init.txt
  "8", // 056 8 Text, Fortress gates on travel map
  "9", // 057 9 Text
  "colon", // 058 : Interface text, strawberry*, prickle berry*, fisher berry*, sun berry*, snowstorms, underground shrubs*
  "semicolon", // 059 ; Interface text (command menu Movies key), Mason's workshop, Kitchen, Selenite*, twigs$
  "stairsUp", // 060 < Interface text (trading screen "Less than 1 unit weight"), brackets around squad names, Stairs up, west move indicator (adventure mode)
  "stockpileEmpty", // 061 = Empty Stockpiles, hamlets on world map, various stones*, middle-left tile of Furnaces, up-right tile of Carpenter's workshop
  "stairsDown", // 062 > Brackets around squad names, Stairs down, east move indicator (adventure mode)
  "question", // 063 ? Text, various status icons
  // Row 05 (064-079)
  "dwarfBerserk", // 064 @ berserk dwarf#, adventurer#, dwarven merchants#, dwarven caravan guards#, dwarven diplomat#, adventurer's location on map
  "A", // 065 A Text, various creatures#, Tile in Farm Workshop
  "B", // 066 B Text, various creatures#
  "C", // 067 C Text, various creatures#, construction designations
  "D", // 068 D Text, various creatures#, Depot Access Display
  "E", // 069 E Text, various creatures#
  "F", // 070 F Text, various creatures#
  "G", // 071 G Text, various creatures#
  "H", // 072 H Text, various creatures#, high traffic designation
  "I", // 073 I Text, various creatures#, support, Necromancer's tower on world map
  "J", // 074 J Text, various creatures#
  "K", // 075 K Text, various creatures#
  "L", // 076 L Text, various creatures#, low traffic designation
  "M", // 077 M Text, various creatures#
  "N", // 078 N Text, various creatures#
  "O", // 079 O Text, various creatures#, trade depot post, glass portal, Tile in Farm Workshop, column$, wall construction, full moon on travel map and dwarf mode, trunk$, staring eyeball*, bubble bulb*, windmill hub
  // Row 06 (080-095)
  "P", // 080 P Text, various creatures#
  "Q", // 081 Q Text
  "R", // 082 R Text, various creatures#, restricted traffic designation
  "S", // 083 S Text, various creatures#
  "T", // 084 T Text, various creatures#
  "U", // 085 U Text, various creatures#
  "V", // 086 V Text, Badlands on map
  "W", // 087 W Text, various creatures#, Depot Access Display
  "X", // 088 X Text, wear tags, keyboard cursor, Bin, floodgate, shop post, building footprint, Depot Access Display, up/down stairs, Tile in Ashery, Archery target, various status indicators
  "Y", // 089 Y Text, Yak#, Yeti#
  "Z", // 090 Z Text, Sleep indicator
  "clothing", // 091 [ Text, Floor tile in workshops, Clothing, armor, item stack opening tag, moon on travel map, tracks (bootprints) in sneaking mode
  "backslash", // 092 \ Overlapping creatures animation, Ballista tile, helves*v0.43.01, active windmill blade
  "bracketRight", // 093 ] Text, Floor tile in workshops and furnaces, item stack closing tag
  "caret", // 094 ^ Trap, Alabaster*, Aluminum*, Volcano on world map, north move indicator (adventure mode)
  "underscore", // 095 _ Text, Channel designation
  // Row 07 (096-111)
  "floorRough4", // 096 ` Rough floors, unexplored underground*, various stones*, various grasses*
  "a", // 097 a Text, various creatures#
  "b", // 098 b Text, various creatures#
  "c", // 099 c Text, various creatures#
  "d", // 100 d Text, various creatures#
  "e", // 101 e Text, various creatures#
  "f", // 102 f Text, various creatures#
  "g", // 103 g Text, various creatures#
  "h", // 104 h Text, various creatures#
  "i", // 105 i Text, various creatures#
  "j", // 106 j Text, various creatures#
  "k", // 107 k Text, various creatures#
  "l", // 108 l Text, various creatures#
  "m", // 109 m Text, various creatures#
  "n", // 110 n Text, various creatures#, Hills on map
  "o", // 111 o Text, various creatures#, Graphite*, well construction, bridge construction, millstone in action, vertical axle in action, floor tile in magma furnaces, staring eyeball*, bubble bulb*, winter melon*, watermelon*
  // Row 08 (112-127)
  "p", // 112 p Text, various creatures#
  "q", // 113 q Text
  "r", // 114 r Text, various creatures#
  "s", // 115 s Text, various creatures#
  "t", // 116 t Text, various creatures#
  "u", // 117 u Text
  "v", // 118 v Text, various creatures#, various stones*, south move indicator (adventure mode)
  "w", // 119 w Text, various creatures#
  "x", // 120 x Text, wear tags, Saltpeter*
  "y", // 121 y Text
  "z", // 122 z Text
  "braceLeft", // 123 { Forbidden opening tag, tile in Jeweler's workshop, vermin, purring maggot#
  "pipe", // 124 | Talc*, pipe sections, overlapping creatures animation
  "braceRight", // 125 } Forbidden closing tag, vermin, purring maggot alternate*
  "roadUnfinishedRough", // 126 ~ Unfinished rough stone road, flowing water, dirt road, farm plot under construction, sand, furrowed soil, blood smear, guts, Various creatures#, Magnetite*
  "animalTrap", // 127 ⌂ Animal trap, low mountains on world map, part of mechanic's workshop, trunk$
  // Row 09 (128-143)
  "mechanism", // 128 Ç Text, Mechanisms
  "ü", // 129 ü Text
  "é", // 130 é Text
  "â", // 131 â Text
  "angel", // 132 ä Text, Angels
  "à", // 133 à Text
  "å", // 134 å Text
  "totem", // 135 ç Text, Totems
  "ê", // 136 ê Text
  "elfMilitary", // 137 ë Text, military elves
  "è", // 138 è Text
  "pedestal", // 139 ï Text, Pedestal*
  "elfForestRetreat", // 140 î Text, Elven forest retreat
  "ì", // 141 ì Text
  "deity", // 142 Ä Deities, Angels
  "figurine", // 143 Å Text, Figurines, shrines on travel map
  // Row 10 (144-159)
  "É", // 144 É Text
  "toy", // 145 æ Toys, hamlets on world map
  "coffer", // 146 Æ Coffers, quivers, backpacks, hamlets on world map
  "cauldron", // 147 ô Text, Cauldrons*
  "ring", // 148 ö Text, Rings
  "leverOff", // 149 ò Text, Unactivated levers, Various creatures#
  "bucket", // 150 û Text, Buckets
  "ù", // 151 ù Text
  "herb", // 152 ÿ Text, Valley herb*
  "bracelet", // 153 Ö Bracelets, wheelbarrows*
  "humanMilitary", // 154 Ü Military Humans
  "hatch", // 155 ¢ Hatch covers, musical instrument piecesv0.42.01
  "ore", // 156 £ Various stones*, most unmined ores*,
  "lobster", // 157 ¥ Cave lobster*
  "ladder", // 158 ₧ Stepladder*
  "ropeReed", // 159 ƒ Rope reed*, splints, arrow bamboo*, golden bamboo*, hedge bamboo*
  // Row 11 (160-175)
  "á", // 160 á Text
  "í", // 161 í Text
  "leverOn", // 162 ó Text, Activated levers
  "ú", // 163 ú Text
  "ñ", // 164 ñ Text, Bogeyman
  "nightCreatuire", // Ñ Night creatures
  "goblinSettlement", // ª Goblin settlements on world map
  "cloth", // 167 º Cloth, dark pit
  "instrument", // 168 ¿ Musical Instruments
  "deadPlant", // 169 ⌐ Withered plants*, wormy tendril*
  "wormyTendril", // 170 ¬ wormy tendril*
  "oneHalf", // 171 ½
  "nest", // 172 ¼ Roc nests, roots$, branches$
  "flask", // 173 ¡ Flask, waterskin, Pouch
  "doubleArrowWest", // 174 « Tail of Ballista arrow facing west, item with decoration tags
  "doubleArrowEast", // 175 » Tail of Ballista arrow facing east, item with decoration tags
  // Row 12 (176-191)
  "rockDug1", // 176 ░ Partially dug rock, various flows (miasma, cave-in dust, steam, smoke, etc.), Fishery, fog on travel map, Semi-molten Rock, various stones*, various soils*, fallen leaves, vermin swarm
  "rockDug2", // 177 ▒ Partially dug rock, various flows (miasma, cave-in dust, steam, smoke, etc.), side tiles for catapult, window, fog on travel map, Workshops (craftdwarf's, bowyer's, mason's, mechanic's, jeweler's, clothier's, kitchen, and leather works), various stones*, various kinds of soil*, fallen leaves, vermin swarm
  "rockDug3", // 178 ▓ Partially dug rock, various flows (miasma, cave-in dust, steam, smoke, etc.), floor tile for ice, tanner's shop, butcher's shop, Wagon body, fog on travel map, various kinds of stones*, various kinds of soil*, sky$, fallen leaves
  "riverVertical", // 179 │ Overworld rivers, well chain/rope, bolts in flight, rotating horizontal axles, branches$, active EW water wheel, active windmill blade, upright weapon trap
  "riverTLeft", // 180 ┤ Overworld rivers, top-right tile for Loom, branches$, Glumprong forests*
  "track", // 181 ╡ Blood thorn trees*, bridges, catapult tile, tracks$
  "rollerEast", // 182 ╢ Branches$, east roller
  "smoothWallEndNW", // 183 ╖ Ends of smooth walls
  "smoothWallEndES", // 184 ╕ Ends of smooth walls
  "smoothWallTWest", // 185 ╣ Smooth/constructed walls, tracks$, trunk$
  "smoothWallNS", // 186 ║ Smooth/constructed walls, bridges, wooden doors, center catapult tile, center Ballista tile, axles, tracks$, fortress walls on travel map, trunk$, NS water wheel, windmill blade
  "smoothWallNE", // 187 ╗ Smooth/constructed walls, bridges, tracks$, trunk$
  "smoothWallSE", // 188 ╝ Smooth/constructed walls, bridges, tracks$, trunk$
  "smoothWallEndSW", // 189 ╜ Ends of smooth walls
  "smoothWallEndEN", // 190 ╛ Ends of smooth walls
  "riverNE", // 191 ┐ Overworld rivers, branches$, northeast move indicator (adventure mode)
  // Row 13 (192-207)
  "riverSW", // 192 └ Overworld rivers/Roads, branches$, southwest move indicator (adventure mode)
  "riverTNorth", // 193 ┴ Overworld rivers/Roads, branches$
  "riverTSouth", // 194 ┬ Overworld rivers/Roads, crutches, branches$
  "riverTEast", // 195 ├ Overworld rivers/Roads, top-left tile for Loom, branches$
  "riverWE", // 196 ─ Overworld rivers/Roads, bolts in flight, rotating axles, branches$, active NS water wheel, active windmill blade
  "door", // 197 ┼ Doors, overworld rivers/Roads, floor detailing/engraving in progress, branches$
  "bridgeEast", // 198 ╞ Bridges, trees in winter, (un)dead trees*, Saguaro*, catapult tile, tracks$, branches$
  "rollerWest", // 199 ╟ branches$, west roller
  "smoothWallSW", // 200 ╚ Smooth/constructed walls, bridges, tracks$, fortress walls on travel map, trunk$
  "smoothWallNW", // 201 ╔ Smooth/constructed walls, bridges, tracks$, fortress walls on travel map, trunk$
  "smoothWallTNorth", // 202 ╩ Smooth/constructed walls, tracks$, trunk$
  "smoothWallTSouth", // 203 ╦ Smooth/constructed walls, tracks$, fortress walls on travel map, trunk$
  "smoothWallTEast", // 204 ╠ Smooth/constructed walls, tracks$, trunk$
  "smoothWallWE", // 205 ═ Smooth/constructed walls, bridges, planted crops, center catapult tile, center Ballista tile, axles, tracks$, fortress walls on travel map, trunk$, EW water wheel, windmill blade
  "smoothWallCross", // 206 ╬ Smooth/constructed walls, bridges, fortifications, (flashing) wall detailing/engraving/fortifying in progress, tracks$, trunk$
  "rollerSouth", // 207 ╧ Tail of Ballista arrow facing north, screw press building, branches$, south roller
  // Row 14 (208-223)
  "bridgeTNorth", // 208 ╨ Bridges, catapult tile, tracks$
  "table", // 209 ╤ Table, tail of Ballista arrow facing south, branches$, north roller
  "chair", // 210 ╥ Chairs, bridges, catapult tile, farmer's workshop bottom-middle tile, tracks$
  "smoothWallEndSE", // 211 ╙ Ends of smooth walls
  "smoothWallEndWN", // 212 ╘ Ends of smooth walls
  "smoothWallEndWS", // 213 ╒ Ends of smooth walls
  "smoothWallEndNE", // 214 ╓ Ends of smooth walls
  "floodgate", // 215 ╫ Wooden floodgates, bone floodgates, wall grates
  "doorDesignation", // 216 ╪ Door designation
  "riverSE", // 217 ┘ Overworld rivers, branches$, southeast move indicator (adventure mode)
  "rightNW", // 218 ┌ Overworld rivers, branches$, northwest move indicator (adventure mode)
  "border", // 219 █ Interface window border, trade depot tile, ice wall and dig-designated tiles, Mist
  "borderBottom", // 220 ▄ Ballista tile, Siege engine parts
  "borderLeft", // 221 ▌ Ballista tile
  "borderRight", // 222 ▐ Ballista tile
  "borderTop", // 223 ▀ Ballista tile
  // Row 15 (224-239)
  "fish", // 224 α Various fish#, top-center fishery tile, meat, altocumulus clouds on travel map
  "leather", // 225 ß Leather, cumulus clouds on travel map
  "weight", // 226 Γ Weight symbol, various forest trees, tropical forests
  "cabinet", // 227 π Cabinet, Display cases*, dark fortresses
  "trapComponent", // 228 Σ Trap component
  "anvil", // 229 σ Anvil, metalsmith's and magma forge bottom-middle tile, jugs*
  "crown", // 230 µ Crown, ruins on world map
  "sapling", // 231 τ Tree sapling*, pig tail*, cave wheat*, Longland grass*, rat weed*, hide root*, muck root*, blade weed*, sliver barb*, shrubland, arrow bamboo*, golden bamboo*, hedge bamboo*
  "sweetPod", // 232 Φ Sweet pod*, bloated tuber*, kobold bulb*, traction benches, (Large) pots*
  "bed", // 233 Θ Beds, Puddingstone*
  "statue", // 234 Ω Statues, dwarven cities on map, sea nettle jellyfish*
  "earring", // 235 δ Earrings, kennel tile
  "bounder", // 236 ∞ Boulder, dry brook, middle-right butcher's shop tile, various stones*, sea foam, images of clouds, fortress gates on travel map, honeycomb*, scrolls*v0.42.01
  "thread", // 237 φ Thread, loom bottom left tile, farmer's workshop bottom right tile
  "bowyer", // 238 ε Bowyer's workshop middle-right tile
  "tomb", // 239 ∩ Hills on world map, slab building
  // Row 16 (240-255)
  "bar", // 240 ≡ Bars, exceptional quality tags, activity zones, metal doors, floor bars, track stops, cirrus clouds on travel map, hamlets on world map, quire*v0.42.01, bookcase*v0.42.01
  "roadUnfinished", // 241 ± Unfinished road
  "debris1", // 242 ≥ Debris (spent ammo, ballista bolts, and catapult stones), ashes, wormy tendril*
  "debris2", // 243 ≤ Debris (spent ammo, ballista bolts, and catapult stones), ashes, wormy tendril*
  "swamp", // 244 ⌠ swamps on world map, Willow forest/swamp*
  "smeet", // 245 ⌡ sheetsv0.42.01
  "barrel", // 246 ÷ Barrel, screw pump, upper left tile of still, center tile of ashery, upper left tile of kitchen, scroll rollers*v0.42.01, book binding*v0.42.01
  "roadRough", // 247 ≈ Rough stone road or bridge, water, magma, snow, glob (fat/tallow), farm plot, furrowed soil, vomit, blood pools, sea foam, sand, various stones*
  "egg", // 248 ° Sea foam, eggs, staring eyeball*, bubble bulb*, Bowl, Mortar, dark pits on world map
  "dot", // 249 ∙ Vermin*, Boulders at lower elevation, trees at lower elevation, tundra on world map, move indicator frame 2 (adventure mode)
  "seed", // 250 · Seeds, micro-vermin, open space, terrain at lower elevation, plants at lower elevation, tundra on world map, move indicator frame 1 (adventure mode)
  "weaponRack", // 251 √ Weapon racks, badlands in main map, check mark (selecting production materials, confirmed items on manager window)
  "savanna", // 252 ⁿ Savanna, marsh, grassland, badlands
  "bodyPart", // 253 ² Body parts, vermin remains
  "block", // 254 ■ Blocks, minecarts*, vaults on world map, human houses/shops on travel map, progress bars, move indicator frame 3 (adventure mode)
  "star", // 255
];
