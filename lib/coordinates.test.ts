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

    it("returns an array of neighboring ids for the given id with custom distance", () => {
      const neighborIds = coordinates.neighborIds({ x: 3, y: 3 }, 2);
      expect(neighborIds).toEqual([
        "1,1",
        "2,1",
        "3,1",
        "4,1",
        "5,1",
        "1,2",
        "2,2",
        "3,2",
        "4,2",
        "5,2",
        "1,3",
        "2,3",
        "3,3",
        "4,3",
        "5,3",
        "1,4",
        "2,4",
        "3,4",
        "4,4",
        "5,4",
        "1,5",
        "2,5",
        "3,5",
        "4,5",
        "5,5",
      ]);
    });

    it("returns an array of neighboring ids for the given id with custom offset", () => {
      const neighborIds = coordinates.neighborIds({ x: 1, y: 1 }, 1, {
        x: 1,
        y: 1,
      });
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
  });
});
