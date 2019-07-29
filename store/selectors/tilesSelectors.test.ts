import produce from "immer";
import { INITIAL_STATE } from "../reducers/tilesReducer";
import { selectChunks } from "./tilesSelectors";

describe("selectChunks", () => {
  it("returns nothing when there are no tiles", () => {
    expect(
      selectChunks({
        tiles: {
          ...INITIAL_STATE,
        },
      }),
    ).toEqual([]);
  });

  it("caches when nothing has changed", () => {
    const tilesState = produce(INITIAL_STATE, draft => {
      draft.zLevel = 1;
      draft.data["1"] = {
        "1,1": {
          designation: "mine",
          item: undefined,
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
    expect(chunks1).toBe(chunks2);
  });
});
