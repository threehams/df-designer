import { range } from "lodash";
import { createSelector } from "reselect";
import * as coordinates from "../../lib/coordinates";
import { selectLevelTiles } from "../reducers/tilesReducer";
import { SelectedCoords, State } from "../types";

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

export const selectExtents = (state: State) => {
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
