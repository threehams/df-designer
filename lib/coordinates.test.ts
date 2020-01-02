import * as coordinates from "./coordinates";

describe("coordinates", () => {
  describe("neighborIds", () => {
    it("returns an array of neighboring ids for the given id with defaults", () => {
      const neighborIds = coordinates.neighborIds({ x: 2, y: 2 });
      expect(neighborIds).toEqual([
        "1,1",
        "2,1",
        "3,1",
        "1,2",
        "2,2",
        "3,2",
        "1,3",
        "2,3",
        "3,3",
      ]);
    });

    it("returns an array of neighboring ids for the given id with custom offset", () => {
      const neighborIds = coordinates.neighborIds(
        { x: 2, y: 2 },
        {
          startX: 0,
          startY: -1,
          endX: 2,
          endY: 1,
        },
      );
      expect(neighborIds).toEqual([
        "2,1",
        "3,1",
        "4,1",
        "2,2",
        "3,2",
        "4,2",
        "2,3",
        "3,3",
        "4,3",
      ]);
    });
  });
});
