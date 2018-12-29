/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { connect } from "react-redux";

import { State } from "../store";
import { Command, selectCommandMap, Adjustment } from "../store/tool";
import { idFromCoordinates } from "../lib/coordinatesFromId";
import { Tile, tilesActions } from "../store/tiles";
import { Button } from "./Button";

jsx; // tslint:disable-line

interface Props {
  command: Command | null;
  tile: Tile | null;
  setAdjustment: typeof tilesActions.setAdjustment;
}

const tileValue = (tile: Tile | null, adjustment: Adjustment) => {
  if (!tile) {
    return false;
  }
  return tile.adjustments[adjustment.name];
};

const SelectBarBase: React.FunctionComponent<Props> = ({
  command,
  setAdjustment,
  tile,
}) => {
  return (
    <aside
      css={css`
        padding: 10px;
        display: flex;
        flex-flow: column nowrap;
      `}
    >
      {!command && <div>No item selected.</div>}
      {command && tile && (
        <div>
          <div>{command.name}</div>
          {command.adjustments &&
            command.adjustments.map(adjustment => {
              const value =
                tileValue(tile, adjustment) || adjustment.initialValue;
              if (adjustment.type === "toggle") {
                return (
                  <label
                    key={adjustment.name}
                    css={css`
                      display: block;
                    `}
                  >
                    <input
                      type="checkbox"
                      value={adjustment.name}
                      checked={typeof value === "boolean" ? value : false}
                      onChange={() => {
                        return setAdjustment(tile.id, adjustment.name, !value);
                      }}
                    />{" "}
                    {adjustment.name}
                  </label>
                );
              }
              return (
                <div key={adjustment.name}>
                  <Button
                    onClick={() => {
                      setAdjustment(
                        tile.id,
                        adjustment.name,
                        Math.max((value as number) - 1, 1),
                      );
                    }}
                  >
                    -
                  </Button>{" "}
                  {value}{" "}
                  <Button
                    onClick={() => {
                      setAdjustment(
                        tile.id,
                        adjustment.name,
                        Math.min((value as number) + 1, 12),
                      );
                    }}
                  >
                    +
                  </Button>
                </div>
              );
            })}
        </div>
      )}
    </aside>
  );
};

export const SelectBar = connect(
  (state: State) => {
    const tile = selectSelectedTile(state);
    if (!tile) {
      return { tile: null, tileId: null, command: null };
    }
    if (!tile || !tile.item) {
      return { tile, command: null };
    }
    const commandMap = selectCommandMap();

    return {
      tile,
      command: commandMap[tile.item],
    };
  },
  { setAdjustment: tilesActions.setAdjustment },
)(SelectBarBase);

// probably a sign that the ducks don't make a lot of sense yet
const selectSelectedTile = (state: State) => {
  if (!state.tool.selectionStart || !state.tool.selectionEnd) {
    return null;
  }
  if (
    state.tool.selectionEnd.x !== state.tool.selectionStart.x ||
    state.tool.selectionEnd.y !== state.tool.selectionStart.y
  ) {
    return null;
  }
  const id = idFromCoordinates(
    state.tool.selectionStart.x,
    state.tool.selectionStart.y,
  );
  return state.tiles.data[id] || null;
};
