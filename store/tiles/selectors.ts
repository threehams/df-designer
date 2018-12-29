import { State } from "../types";
import { createSelector } from "reselect";
import { selectCommandMap, selectPhases } from "../tool/reducer";
import {
  coordinatesFromId,
  idFromCoordinates,
} from "../../lib/coordinatesFromId";
import { Phase, CommandKey } from "../tool/types";
import { keys } from "../../lib/keys";
import { Tile } from "./types";
import { wallMap, tilesetNames } from "../../lib/tilesetNames";
import { range } from "../../lib/range";

type Grids = { [key in Phase]: string[][] | null };
type GridsResult = { [key in Phase]: string };
export type Dimensions = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};
export type TileSprite = {
  id: string;
  textureName: keyof typeof tilesetNames;
};
export type Chunk = Dimensions & {
  tiles: TileSprite[];
};

const selectExtents = createSelector(
  (state: State) => state.tiles.data,
  tiles => {
    const dimensions = Object.entries(tiles).reduce(
      (result, [id]) => {
        const { x, y } = coordinatesFromId(id);
        result.minX = x < result.minX ? x : result.minX;
        result.minY = y < result.minY ? y : result.minY;
        result.maxX = x + 1 > result.maxX ? x + 1 : result.maxX;
        result.maxY = y + 1 > result.maxY ? y + 1 : result.maxY;
        return result;
      },
      {
        minX: Infinity,
        maxX: 0,
        minY: Infinity,
        maxY: 0,
      },
    );
    if (dimensions.minX === Infinity || dimensions.minY === Infinity) {
      return null;
    }
    return dimensions;
  },
);

export const selectExported = createSelector(
  selectCommandMap,
  selectPhases,
  selectExtents,
  (state: State) => state.tiles.data,
  (commandMap, phases, extents, tiles) => {
    if (!extents) {
      return null;
    }
    const grids = phases.reduce(
      (result, phase) => {
        result[phase.phase] = null;
        return result;
      },
      {} as Grids,
    );
    for (const [id, tile] of Object.entries(tiles)) {
      if (!tile) {
        continue;
      }
      const { x, y } = coordinatesFromId(id);
      const exportCommand = (commandKey: CommandKey | null) => {
        if (!commandKey) {
          return;
        }
        const command = commandMap[commandKey];
        const phase = command.phase;
        if (!grids[phase]) {
          grids[phase] = createGrid(extents);
        }
        grids[phase]![y - extents.minY][x - extents.minX] =
          commandMap[commandKey].shortcut;
      };

      const exportAdjustments = (
        commandKey: CommandKey | null,
        adjustments: { [key: string]: number | boolean },
      ) => {
        if (!commandKey) {
          return;
        }
        const command = commandMap[commandKey];
        if (!command.adjustments) {
          return;
        }
        if (!grids.query) {
          grids.query = createGrid(extents);
        }
        grids.query[y - extents.minY][x - extents.minX] =
          command
            .adjustments!.map(adjustment => {
              if (
                adjustment.type === "toggle" &&
                adjustments[adjustment.name]
              ) {
                return adjustment.shortcut;
              }
              if (adjustment.type === "resize") {
                const delta =
                  ((adjustments[adjustment.name] as number) ||
                    adjustment.initialValue) - adjustment.initialValue;
                if (delta < 0) {
                  return adjustment.decrement.repeat(Math.abs(delta));
                }
                return adjustment.increment.repeat(delta);
              }
            })
            .join("") || "`";
      };
      exportCommand(tile.designation);
      exportCommand(tile.item);
      exportAdjustments(tile.item!, tile.adjustments);
    }
    return keys(grids).reduce(
      (result, phase) => {
        if (grids[phase]) {
          result[phase] = [[`#${phase}`]]
            .concat(grids[phase]!)
            .map(x => x.join(","))
            .join("\n");
        }
        return result;
      },
      {} as GridsResult,
    );
  },
);

const createGrid = (dimensions: Dimensions): string[][] => {
  return Array.from(Array(dimensions.maxY - dimensions.minY).keys()).map(() => {
    return Array(dimensions.maxX - dimensions.minX).fill("`");
  });
};

const CHUNK_SIZE = 10;
export const selectChunks = (state: State) => {
  const extents = selectExtents(state);
  if (!extents) {
    return [];
  }
  // account for walls, and keep consistent 0,0 center
  const allChunkExtents = {
    minX: 0,
    maxX: extents.maxX + 1,
    minY: 0,
    maxY: extents.maxY + 1,
  };
  return range(allChunkExtents.minX, allChunkExtents.maxX, CHUNK_SIZE).flatMap(
    x =>
      range(allChunkExtents.minY, allChunkExtents.maxY, CHUNK_SIZE).flatMap(
        y => {
          const chunkExtents = {
            minX: x,
            maxX: x + CHUNK_SIZE - 1,
            minY: y,
            maxY: y + CHUNK_SIZE - 1,
          };
          return {
            ...chunkExtents,
            tiles: selectTiles(state, chunkExtents),
          };
        },
      ),
  );
  return [
    {
      minX: 0,
      maxX: 10,
      minY: 0,
      maxY: 10,
      tiles: selectTiles(state, {
        minX: 0,
        maxX: 10,
        minY: 0,
        maxY: 10,
      }),
    },
    {
      minX: 0,
      maxX: 10,
      minY: 11,
      maxY: 20,
      tiles: selectTiles(state, {
        minX: 0,
        maxX: 10,
        minY: 11,
        maxY: 20,
      }),
    },
  ];
};

const selectTilesCache: { [key: string]: TileSprite[] } = {};
const selectTiles = (state: State, props: Dimensions) => {
  const key = `${props.minX},${props.minY},${props.maxX},${props.maxY}`;
  let invalidate = false;
  for (const id of state.tiles.updates) {
    if (
      within(id, {
        minX: props.minX - 1,
        minY: props.minY - 1,
        maxX: props.maxX + 1,
        maxY: props.maxY + 1,
      })
    ) {
      invalidate = true;
      break;
    }
  }
  if (!invalidate && selectTilesCache[key]) {
    return selectTilesCache[key];
  }
  const result = createTiles(state.tiles.data, props).concat(
    createWalls(state.tiles.data, props),
  );
  selectTilesCache[key] = result;
  return result;
};

const createTiles = (
  tiles: State["tiles"]["data"],
  props: Dimensions,
): TileSprite[] => {
  const commandMap = selectCommandMap();
  return Object.values(tiles)
    .filter(tile => within(tile.id, props))
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
  tiles: State["tiles"]["data"],
  props: Dimensions,
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
    .filter(wallId => within(wallId, props))
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
  const { x, y } = coordinatesFromId(id);
  return [
    idFromCoordinates(x - 1, y - 1),
    idFromCoordinates(x, y - 1),
    idFromCoordinates(x + 1, y - 1),
    idFromCoordinates(x - 1, y),
    idFromCoordinates(x, y),
    idFromCoordinates(x + 1, y),
    idFromCoordinates(x - 1, y + 1),
    idFromCoordinates(x, y + 1),
    idFromCoordinates(x + 1, y + 1),
  ];
};

const exposed = (tile: Tile | null) => {
  if (!tile) {
    return false;
  }
  return !!tile.designation;
};

function within(id: string, { minX, maxX, minY, maxY }: Dimensions) {
  const { x, y } = coordinatesFromId(id);
  return minX <= x && x <= maxX && minY <= y && y <= maxY;
}
