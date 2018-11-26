import { createSelector } from "reselect";

import { State } from "../";
import { selectCommandMap, selectPhases, Command } from "../tool";
import { coordinatesFromId } from "../../lib/coordinatesFromId";

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
    const grid = Array.from(
      Array(dimensions.maxY - dimensions.minY).keys(),
    ).map(() => {
      return Array(dimensions.maxX - dimensions.minX).fill("`");
    });
    for (const phase of phases) {
      for (const [id, commands] of Object.entries(tiles)) {
        const { x, y } = coordinatesFromId(id);
        const command = commands.find(
          comm => commandMap[comm].phase === phase.phase,
        );
        if (command) {
          grid[y - dimensions.minY][x - dimensions.minX] =
            commandMap[command].shortcut;
        }
      }
    }
    return grid.map(x => x.join(",")).join("\n");
  },
);
