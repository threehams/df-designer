import { createSelector } from "reselect";
import * as coordinates from "../../lib/coordinates";
import { keys } from "../../lib/keys";
import { range } from "../../lib/range";
import { tilesetNames, wallMap } from "../../lib/tilesetNames";
import { selectCommandMap, selectPhases } from "../tool/reducer";
import { CommandKey, Phase, SelectedCoords } from "../tool/types";
import { State } from "../types";
import { selectLevelTiles } from "./reducer";
import { Tile } from "./types";

type Grids = { [key in Phase]: string[][] | null };
type GridsResult = { [key in Phase]: string };
export type TileSprite = {
  id: string;
  textureName: keyof typeof tilesetNames;
};
export type Chunk = SelectedCoords & {
  tiles: TileSprite[];
};

const selectExtents = createSelector(
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
        endX: 0,
        startY: Infinity,
        endY: 0,
      },
    );
    if (dimensions.startX === Infinity || dimensions.startY === Infinity) {
      return null;
    }
    return dimensions;
  },
);

export const selectExported = createSelector(
  selectCommandMap,
  selectPhases,
  selectExtents,
  selectLevelTiles,
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
      const { x, y } = coordinates.fromId(id);
      const exportCommand = (commandKey: CommandKey | null) => {
        if (!commandKey) {
          return;
        }
        const command = commandMap[commandKey];
        const phase = command.phase;
        if (!grids[phase]) {
          grids[phase] = createGrid(extents);
        }
        grids[phase]![y - extents.startY][x - extents.startX] =
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
        grids.query[y - extents.startY][x - extents.startX] =
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

const createGrid = (dimensions: SelectedCoords): string[][] => {
  return Array.from(Array(dimensions.endY - dimensions.startY).keys()).map(
    () => {
      return Array(dimensions.endX - dimensions.startX).fill("`");
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

const selectTilesCache: { [key: string]: TileSprite[] } = {};
const selectTiles = (state: State, selection: SelectedCoords) => {
  const tiles = selectLevelTiles(state);
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
  if (!invalidate && selectTilesCache[key]) {
    return selectTilesCache[key];
  }
  const result = createTiles(tiles, selection).concat(
    createWalls(tiles, selection),
  );
  selectTilesCache[key] = result;
  return result;
};

const createTiles = (
  tiles: State["tiles"]["data"],
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
  tiles: State["tiles"]["data"],
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
