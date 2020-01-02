import produce from "immer";
import { INITIAL_STATE } from "../reducers/tilesReducer";
import { selectChunks } from "./tilesSelectors";

describe("selectChunks", () => {
  it("returns initialization data", () => {
    expect(
      selectChunks({
        tiles: INITIAL_STATE,
      }),
    ).toEqual([
      {
        startX: 0,
        endX: 9,
        endY: 9,
        startY: 0,
        tiles: [],
      },
    ]);
  });

  it("caches when nothing has changed", () => {
    const tilesState = produce(INITIAL_STATE, draft => {
      draft.zLevel = 1;
      draft.data["1"] = {
        "1,1": {
          designation: "mine",
          item: undefined,
          multitileOrigin: undefined,
          adjustments: {},
          id: "1,1",
          coordinates: {
            x: 1,
            y: 1,
          },
        },
      };
    });
    const chunks1 = selectChunks({ tiles: tilesState });
    const chunks2 = selectChunks({ tiles: tilesState });
    expect(chunks1[0].tiles).toBe(chunks2[0].tiles);
  });

  describe("walls", () => {
    it("creates walls around the designation", () => {
      const tilesState = produce(INITIAL_STATE, draft => {
        draft.zLevel = 1;
        draft.data["1"] = {
          "1,1": {
            designation: "mine",
            item: undefined,
            adjustments: {},
            multitileOrigin: undefined,
            id: "1,1",
            coordinates: {
              x: 1,
              y: 1,
            },
          },
          "1,2": {
            designation: "mine",
            item: undefined,
            multitileOrigin: undefined,
            adjustments: {},
            id: "1,2",
            coordinates: {
              x: 1,
              y: 2,
            },
          },
        };
      });
      const tiles = selectChunks({ tiles: tilesState })[0].tiles;
      expect(tiles).toEqual([
        { id: "1,1", textureName: "plus" },
        { id: "0,0", textureName: "smoothWallNW" },
        { id: "1,0", textureName: "smoothWallWE" },
        { id: "2,0", textureName: "smoothWallNE" },
        { id: "0,1", textureName: "smoothWallNS" },
        { id: "2,1", textureName: "smoothWallNS" },
        { id: "0,2", textureName: "smoothWallSW" },
        { id: "1,2", textureName: "smoothWallWE" },
        { id: "2,2", textureName: "smoothWallSE" },
      ]);
    });

    it("creates walls when designations overlap chunk boundaries", () => {
      const tilesState = produce(INITIAL_STATE, draft => {
        draft.zLevel = 1;
        draft.data["1"] = {
          "0,0": {
            designation: "mine",
            item: undefined,
            multitileOrigin: undefined,
            adjustments: {},
            id: "0,0",
            coordinates: {
              x: 0,
              y: 0,
            },
          },
          "9,9": {
            designation: "mine",
            item: undefined,
            multitileOrigin: undefined,
            adjustments: {},
            id: "9,9",
            coordinates: {
              x: 9,
              y: 9,
            },
          },
        };
      });
      const chunks = selectChunks({ tiles: tilesState });
      expect(chunks).toEqual([
        {
          startX: 0,
          endX: 9,
          startY: 0,
          endY: 9,
          tiles: [
            { id: "1,1", textureName: "plus" },
            { id: "0,0", textureName: "smoothWallNW" },
            { id: "1,0", textureName: "smoothWallWE" },
            { id: "2,0", textureName: "smoothWallNE" },
            { id: "0,1", textureName: "smoothWallNS" },
            { id: "2,1", textureName: "smoothWallNS" },
            { id: "0,2", textureName: "smoothWallSW" },
            { id: "1,2", textureName: "smoothWallWE" },
            { id: "2,2", textureName: "smoothWallSE" },
          ],
        },
        {
          startX: 0,
          endX: 9,
          startY: 10,
          endY: 19,
          tiles: [
            { id: "8,10", textureName: "smoothWallSW" },
            { id: "9,10", textureName: "smoothWallWE" },
          ],
        },
        {
          startX: 10,
          endX: 19,
          startY: 0,
          endY: 9,
          tiles: [
            { id: "10,8", textureName: "smoothWallNE" },
            { id: "10,9", textureName: "smoothWallNS" },
          ],
        },
        {
          startX: 10,
          endX: 19,
          startY: 10,
          endY: 19,
          tiles: [{ id: "10,10", textureName: "smoothWallSE" }],
        },
      ]);
    });
  });
});
