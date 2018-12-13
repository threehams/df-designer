import { State } from "../types";
import { createSelector } from "reselect";
import { selectCommandMap, selectPhases } from "../tool/reducer";
import {
  coordinatesFromId,
  idFromCoordinates,
} from "../../lib/coordinatesFromId";
import { Phase, CommandKey, CommandMap } from "../tool/types";
import { keys } from "../../lib/keys";
import produce from "immer";
import { Tile } from "./types";

type Grids = { [key in Phase]: string[][] | null };
type GridsResult = { [key in Phase]: string };
type Dimensions = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};
export const selectExported = createSelector(
  selectCommandMap,
  selectPhases,
  (state: State) => state.tiles.data,
  (commandMap, phases, tiles) => {
    return {};
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
    const grids = phases.reduce(
      (result, phase) => {
        result[phase.phase] = null;
        return result;
      },
      {} as Grids,
    );
    for (const phase of phases) {
      for (const [id, commands] of Object.entries(tiles)) {
        const { x, y } = coordinatesFromId(id);
        const command = commands.find(
          comm => commandMap[comm].phase === phase.phase,
        );
        if (command) {
          if (!grids[phase.phase]) {
            grids[phase.phase] = createGrid(dimensions);
          }
          grids[phase.phase]![y - dimensions.minY][x - dimensions.minX] =
            commandMap[command].shortcut;
        }
      }
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

const createGrid = (dimensions: Dimensions) => {
  return Array.from(Array(dimensions.maxY - dimensions.minY).keys()).map(() => {
    return Array(dimensions.maxX - dimensions.minX).fill("`");
  });
};

export const selectWalls = createSelector(
  (state: State) => state.tiles.data,
  selectCommandMap,
  (tiles, commandMap) => {
    const walls = new Set();
    produce(tiles, draft => {
      Object.entries(tiles).forEach(([tileId, tile]) => {
        if (exposed(tile, commandMap)) {
          for (const id of neighborIds(tileId)) {
            if (!draft[id]) {
              walls.add(id);
            }
          }
        }
      });
    });
    return walls;
  },
);

// matrix or something, never had to deal with this
const neighborIds = (id: string) => {
  const { x, y } = coordinatesFromId(id);
  return [
    idFromCoordinates(x - 1, y + 1),
    idFromCoordinates(x, y + 1),
    idFromCoordinates(x + 1, y + 1),
    idFromCoordinates(x - 1, y),
    idFromCoordinates(x, y),
    idFromCoordinates(x + 1, y),
    idFromCoordinates(x - 1, y - 1),
    idFromCoordinates(x, y - 1),
    idFromCoordinates(x + 1, y - 1),
  ];
};

const exposed = (tile: Tile | null, commandMap: CommandMap) => {
  if (!tile) {
    return false;
  }
  return !!tile.designation;
};
