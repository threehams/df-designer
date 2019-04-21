import { selectChunks } from "./tilesSelectors";
import { INITIAL_STATE } from "../reducers/tilesReducer";

describe("selectChunks", () => {
  it("selects chunks", () => {
    selectChunks({
      tiles: {
        ...INITIAL_STATE,
      },
    });
  });
});
