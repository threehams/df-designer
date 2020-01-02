import { range } from "lodash";
import { createSelector } from "reselect";
import * as coordinates from "../../lib/coordinates";
import { wallMap } from "../../static";
import { selectLevelTiles, selectTile } from "../reducers/tilesReducer";
import { selectCommandMap, selectSelection } from "../reducers/toolReducer";
import {
  Coords,
  SelectedCoords,
  State,
  Tile,
  TilesMap,
  TileSprite,
} from "../types";
import { selectExtents } from "./extentsSelectors";

export const selectSelectedTile = (state: State) => {
  const selection = selectSelection(state);
  if (!selection) {
    return {
      command: undefined,
      multiSelect: false,
      tile: undefined,
    };
  }
  const commandMap = selectCommandMap();

  if (
    selection.startX !== selection.endX ||
    selection.startY !== selection.endY
  ) {
    return {
      command: undefined,
      multiSelect: true,
      tile: undefined,
    };
  }
  const tile =
    selectTile(state, { x: selection.startX, y: selection.startY }) ||
    undefined;
  return {
    command: tile && tile.item ? commandMap[tile.item] : undefined,
    tile,
    multiSelect: false,
  };
};

const CHUNK_SIZE = 10;
export const selectChunks = createSelector(
  (state: Pick<State, "tiles">) => state.tiles,
  selectExtents,
  (tiles, extents) => {
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
            tiles: selectTiles({ tiles }, chunkExtents),
          };
        },
      ),
    );
  },
);

const selectTilesCache: {
  zLevel: number;
  cache: { [key: string]: TileSprite[] };
} = {
  zLevel: 0,
  cache: {},
};
const selectTiles = (
  state: Pick<State, "tiles">,
  selection: SelectedCoords,
): TileSprite[] => {
  if (selectTilesCache.zLevel !== state.tiles.zLevel) {
    selectTilesCache.zLevel = state.tiles.zLevel;
    selectTilesCache.cache = {};
  }
  const tiles = selectLevelTiles(state, { zLevel: state.tiles.zLevel });
  const key = `${selection.startX},${selection.startY},${selection.endX},${selection.endY}`;
  let invalidate = false;
  for (const update of state.tiles.updates) {
    const { x, y } = coordinates.fromId(update.id);
    // ignore updates happening offscreen
    if (update.zLevel !== state.tiles.zLevel) {
      continue;
    }
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
    .filter(tile => coordinates.within(selection, tile.coordinates))
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

// TODO performance issues with fromId
const createWalls = (
  tiles: TilesMap,
  selection: SelectedCoords,
): TileSprite[] => {
  const walls = new Set<string>();

  function addWalls(tile: Tile): void {
    if (exposed(tile)) {
      // for loop for performance over for...of :O
      for (let offsetY = -1; offsetY <= 1; offsetY++) {
        for (let offsetX = -1; offsetX <= 1; offsetX++) {
          if (offsetY === 0 && offsetX === 0) {
            continue;
          }
          const { x, y } = tile.coordinates;
          const id = `${x + offsetX},${y + offsetY}`;
          if (!tiles[id]) {
            walls.add(id);
          }
        }
      }
    }
  }
  Object.values(tiles).forEach(addWalls);
  return (
    Array.from(walls.values())
      // TODO performance issues with within
      .filter(wallId => within(coordinates.fromId(wallId), selection))
      .map(wallId => {
        const wallNumber = coordinates
          .neighborIds(coordinates.fromId(wallId))
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
      })
  );
};

const exposed = (tile: Tile | undefined) => {
  if (!tile) {
    return false;
  }
  return !!tile.designation;
};

// TODO move to shared place along with tiles/actions version
const within = (
  { x, y }: Coords,
  { startX, endX, startY, endY }: SelectedCoords,
) => {
  return startX <= x && x <= endX && startY <= y && y <= endY;
};
