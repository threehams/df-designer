import { State } from "../types";
import { createSelector } from "reselect";
import { selectCommandMap, selectPhases } from "../tool/reducer";
import {
  coordinatesFromId,
  idFromCoordinates,
} from "../../lib/coordinatesFromId";
import { Phase, Command, CommandMap } from "../tool/types";
import { keys } from "../../lib/keys";
import produce from "immer";

type Grids = { [key in Phase]: string[][] };
type GridsResult = { [key in Phase]: string };

export const selectExported = createSelector(
  selectCommandMap,
  selectPhases,
  (state: State) => state.tiles.data,
  (commandMap, phases, tiles) => {
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
        result[phase.phase] = Array.from(
          Array(dimensions.maxY - dimensions.minY).keys(),
        ).map(() => {
          return Array(dimensions.maxX - dimensions.minX).fill("`");
        });
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
          grids[phase.phase][y - dimensions.minY][x - dimensions.minX] =
            commandMap[command].shortcut;
        }
      }
    }
    return keys(grids).reduce(
      (result, phase) => {
        result[phase] = [[`#${phase}`]]
          .concat(grids[phase])
          .map(x => x.join(","))
          .join("\n");
        return result;
      },
      {} as GridsResult,
    );
  },
);

export const selectWalls = createSelector(
  (state: State) => state.tiles.data,
  selectCommandMap,
  (tiles, commandMap) => {
    const walls = new Set();
    produce(tiles, draft => {
      Object.entries(tiles).forEach(([tileId, tileCommands]) => {
        if (exposed(tileCommands, commandMap)) {
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

const exposed = (commands: Command[] | null, commandMap: CommandMap) => {
  if (!commands) {
    return false;
  }
  return commands.filter(command => commandMap[command].phase === "dig").length;
};
