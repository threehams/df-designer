import { range } from "lodash";
import { createSelector } from "reselect";
import * as coordinates from "../../lib/coordinates";
import { entries } from "../../lib/entries";
import { keys } from "../../lib/keys";
import { tilesetNames, wallMap } from "../../lib/tilesetNames";
import { selectLevelTiles } from "../reducers/tilesReducer";
import {
  selectAdjustmentMap,
  selectCommandMap,
  selectPhases,
} from "../reducers/toolReducer";
import { CommandSlug, PhaseSlug, SelectedCoords } from "../types";
import { State } from "../types";
import { AdjustmentData, Tile, TilesMap } from "../types";

type Grids = { [key in PhaseSlug]: string[][] | null };
type GridsResult = { [key in PhaseSlug]: string };
export type TileSprite = {
  id: string;
  textureName: keyof typeof tilesetNames;
};
export type Chunk = SelectedCoords & {
  tiles: TileSprite[];
};

const selectLevelExtents = createSelector(
  selectLevelTiles,
  tiles => {
    const dimensions = Object.entries(tiles).reduce(
      (result, [id]) => {
        const { x, y } = coordinates.fromId(id);
        result.startX = x < result.startX ? x : result.startX;
        result.startY = y < result.startY ? y : result.startY;
        result.endX = x + 1 > result.endX ? x + 1 : result.endX;
        result.endY = y + 1 > result.endY ? y + 1 : result.endY;
        return result;
      },
      {
        startX: Infinity,
        startY: Infinity,
        endX: 0,
        endY: 0,
      },
    );
    if (dimensions.startX === Infinity || dimensions.startY === Infinity) {
      return null;
    }
    return dimensions;
  },
);

const selectExtents = (state: State) => {
  return range(127, -1)
    .map(zLevel => {
      return selectLevelExtents(state, { zLevel });
    })
    .filter(Boolean)
    .reduce(
      (result: SelectedCoords, extents) => {
        result.startX = Math.min(result.startX, extents!.startX);
        result.startY = Math.min(result.startY, extents!.startY);
        result.endX = Math.max(result.endX, extents!.endX);
        result.endY = Math.max(result.endY, extents!.endY);
        return result;
      },
      {
        startX: Infinity,
        startY: Infinity,
        endX: 0,
        endY: 0,
      } as SelectedCoords,
    );
};

export const selectExported = (state: State) => {
  return range(127, -1)
    .map(zLevel => {
      return selectExportedLevel(state, { zLevel });
    })
    .filter(Boolean)
    .reduce(
      (result: GridsResult, exported) => {
        entries(exported!).forEach(([phase, string]) => {
          result[phase] = result[phase]
            ? `${result[phase]}\n#>\n${string}`
            : string;
        });
        return result;
      },
      {} as GridsResult,
    );
};

const selectExportedLevel = createSelector(
  selectAdjustmentMap,
  selectCommandMap,
  selectPhases,
  selectExtents,
  selectLevelTiles,
  (adjustmentMap, commandMap, phases, extents, tiles) => {
    if (!extents) {
      return null;
    }
    const grids = phases.reduce(
      (result, phase) => {
        result[phase.slug] = null;
        return result;
      },
      {} as Grids,
    );
    for (const [id, tile] of Object.entries(tiles)) {
      if (!tile) {
        continue;
      }
      const { x, y } = coordinates.fromId(id);
      const exportCommand = (commandSlug: CommandSlug | null) => {
        if (!commandSlug) {
          return;
        }
        const command = commandMap[commandSlug];
        const phase = command.phase;
        if (!grids[phase]) {
          grids[phase] = createGrid(extents);
        }
        grids[phase]![y - extents.startY][x - extents.startX] =
          commandMap[commandSlug].shortcut;
      };

      const exportAdjustments = (adjustments: AdjustmentData) => {
        if (!grids.query) {
          grids.query = createGrid(extents);
        }
        grids.query[y - extents.startY][x - extents.startX] =
          entries(adjustments)
            .map(([name, value]) => {
              const adjustment = adjustmentMap[name];
              if (value) {
                if (adjustment.type === "resize") {
                  const numberValue = value as number;
                  const suffix =
                    value < adjustment.initialSize
                      ? "-".repeat(adjustment.initialSize - numberValue)
                      : "+".repeat(numberValue - adjustment.initialSize);
                  return `${adjustment.shortcut}${suffix}`;
                }
                return adjustment.shortcut;
              }
              return "";
            })
            .join("") || "~";
      };
      exportCommand(tile.designation);
      exportCommand(tile.item);
      exportAdjustments(tile.adjustments);
    }
    return keys(grids).reduce(
      (result, phase) => {
        if (grids[phase]) {
          result[phase] = grids[phase]!.map(x => x.join(",")).join("\n");
        }
        return result;
      },
      {} as GridsResult,
    );
  },
);

const createGrid = (dimensions: SelectedCoords): string[][] => {
  return Array.from(Array(dimensions.endY - dimensions.startY).keys()).map(
    () => {
      return Array(dimensions.endX - dimensions.startX).fill("~");
    },
  );
};

const CHUNK_SIZE = 10;
export const selectChunks = (state: State) => {
  const extents = selectExtents(state);
  if (!extents) {
    return [];
  }
  // account for walls, and keep consistent 0,0 center
  const allChunkExtents = {
    startX: 0,
    endX: extents.endX + 1,
    startY: 0,
    endY: extents.endY + 1,
  };
  return range(
    allChunkExtents.startX,
    allChunkExtents.endX,
    CHUNK_SIZE,
  ).flatMap(x =>
    range(allChunkExtents.startY, allChunkExtents.endY, CHUNK_SIZE).flatMap(
      y => {
        const chunkExtents = {
          startX: x,
          endX: x + CHUNK_SIZE - 1,
          startY: y,
          endY: y + CHUNK_SIZE - 1,
        };
        return {
          ...chunkExtents,
          tiles: selectTiles(state, chunkExtents),
        };
      },
    ),
  );
};

const selectTilesCache: {
  zLevel: number;
  cache: { [key: string]: TileSprite[] };
} = {
  zLevel: 0,
  cache: {},
};
const selectTiles = (state: State, selection: SelectedCoords) => {
  if (selectTilesCache.zLevel !== state.tiles.zLevel) {
    selectTilesCache.zLevel = state.tiles.zLevel;
    selectTilesCache.cache = {};
  }
  const tiles = selectLevelTiles(state, { zLevel: state.tiles.zLevel });
  const key = `${selection.startX},${selection.startY},${selection.endX},${
    selection.endY
  }`;
  let invalidate = false;
  for (const id of state.tiles.updates) {
    const { x, y } = coordinates.fromId(id);
    if (coordinates.within(coordinates.expand(selection, 1), { x, y })) {
      invalidate = true;
      break;
    }
  }
  if (!invalidate && selectTilesCache.cache[key]) {
    return selectTilesCache.cache[key];
  }
  const result = createTiles(tiles, selection).concat(
    createWalls(tiles, selection),
  );
  selectTilesCache.cache[key] = result;
  return result;
};

const createTiles = (
  tiles: TilesMap,
  selection: SelectedCoords,
): TileSprite[] => {
  const commandMap = selectCommandMap();
  return Object.values(tiles)
    .filter(tile => coordinates.within(selection, coordinates.fromId(tile.id)))
    .reduce((result: TileSprite[], tile) => {
      if (tile.designation) {
        result.push({
          id: tile.id,
          textureName: commandMap[tile.designation].textures[0],
        });
      }
      if (tile.item) {
        result.push({
          id: tile.id,
          textureName: commandMap[tile.item].textures[0],
        });
      }
      return result;
    }, []);
};

const createWalls = (
  tiles: TilesMap,
  selection: SelectedCoords,
): TileSprite[] => {
  const walls = new Set<string>();
  Object.entries(tiles).forEach(([tileId, tile]) => {
    if (exposed(tile)) {
      for (const id of neighborIds(tileId)) {
        if (!tiles[id]) {
          walls.add(id);
        }
      }
    }
  });
  return Array.from(walls.values())
    .filter(wallId => within(wallId, selection))
    .map(wallId => {
      const wallNumber = neighborIds(wallId)
        .filter(id => id !== wallId)
        .reduce((bits, id, index) => {
          if (exposed(tiles[id])) {
            return bits + 2 ** index;
          }
          return bits;
        }, 0);

      return {
        id: wallId,
        textureName: wallMap[wallNumber],
      };
    });
};

// TODO loops are fun and all
const neighborIds = (id: string) => {
  const { x, y } = coordinates.fromId(id);
  return [
    coordinates.toId(x - 1, y - 1),
    coordinates.toId(x, y - 1),
    coordinates.toId(x + 1, y - 1),
    coordinates.toId(x - 1, y),
    coordinates.toId(x, y),
    coordinates.toId(x + 1, y),
    coordinates.toId(x - 1, y + 1),
    coordinates.toId(x, y + 1),
    coordinates.toId(x + 1, y + 1),
  ];
};

const exposed = (tile: Tile | null) => {
  if (!tile) {
    return false;
  }
  return !!tile.designation;
};

// TODO move to shared place along with tiles/actions version
const within = (id: string, { startX, endX, startY, endY }: SelectedCoords) => {
  const { x, y } = coordinates.fromId(id);
  return startX <= x && x <= endX && startY <= y && y <= endY;
};
