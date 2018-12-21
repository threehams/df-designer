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
  tileId: string | null;
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
  tileId,
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
      {command && (
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
                        if (tileId) {
                          return setAdjustment(tileId, adjustment.name, !value);
                        }
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
                        tileId!,
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
                        tileId!,
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
    if (!state.tool.selectedItem) {
      return { tile: null, tileId: null, command: null };
    }
    const { x, y } = state.tool.selectedItem;
    const tileId = idFromCoordinates(x, y);
    const tile = state.tiles.data[tileId];
    if (!tile || !tile.item) {
      return { tile, tileId, command: null };
    }
    const commandMap = selectCommandMap();

    return {
      tile,
      tileId,
      command: commandMap[tile.item],
    };
  },
  { setAdjustment: tilesActions.setAdjustment },
)(SelectBarBase);
