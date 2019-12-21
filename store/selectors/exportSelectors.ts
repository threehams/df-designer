import { range } from "lodash";
import { createSelector } from "reselect";
import * as coordinates from "../../lib/coordinates";
import { entries } from "../../lib/entries";
import { keys } from "../../lib/keys";
import { selectLevelTiles } from "../reducers/tilesReducer";
import {
  selectAdjustmentMap,
  selectCommandMap,
  selectPhases,
} from "../reducers/toolReducer";
import {
  AdjustmentData,
  CommandSlug,
  PhaseSlug,
  SelectedCoords,
  State,
} from "../types";
import { selectExtents } from "./extentsSelectors";
import { nonNull } from "../../lib/nonNull";

type Grids = { [key in PhaseSlug]: string[][] | undefined };
type GridsResult = { [key in PhaseSlug]: string };

const createGrid = (dimensions: SelectedCoords): string[][] => {
  return Array.from(Array(dimensions.endY - dimensions.startY).keys()).map(
    () => {
      return Array(dimensions.endX - dimensions.startX).fill("~");
    },
  );
};

export const selectExported = (state: State): GridsResult => {
  return range(127, -1)
    .map(zLevel => {
      return selectExportedLevel(state, { zLevel });
    })
    .filter(nonNull)
    .reduce((result: GridsResult, exported) => {
      entries(exported).forEach(([phase, string]) => {
        result[phase] = result[phase]
          ? `${result[phase]}\n#>\n${string}`
          : string;
      });
      return result;
    }, {} as GridsResult);
};

const selectExportedLevel = createSelector(
  selectAdjustmentMap,
  selectCommandMap,
  selectPhases,
  selectExtents,
  selectLevelTiles,
  (
    adjustmentMap,
    commandMap,
    phases,
    extents,
    tiles,
  ): GridsResult | undefined => {
    if (!extents) {
      return undefined;
    }
    const grids = phases.reduce((result, phase) => {
      result[phase.slug] = undefined;
      return result;
    }, {} as Grids);
    for (const [id, tile] of Object.entries(tiles)) {
      if (!tile) {
        continue;
      }
      const { x, y } = coordinates.fromId(id);
      const exportCommand = (commandSlug: CommandSlug | undefined) => {
        if (!commandSlug) {
          return;
        }
        const command = commandMap[commandSlug];
        const phase = command.phase;
        grids[phase] = grids[phase] || createGrid(extents);
        // unsure how to write this
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
    return keys(grids).reduce((result, phase) => {
      const grid = grids[phase];
      if (grid) {
        result[phase] = grid.map(x => x.join(",")).join("\n");
      }
      return result;
    }, {} as GridsResult);
  },
);
