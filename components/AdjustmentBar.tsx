/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import { Tile, tilesActions } from "../store/tiles";
import { Adjustment, Command } from "../store/tool";
import { Button } from "./Button";

jsx; // tslint:disable-line

interface Props {
  command: Command;
  tile: Tile;
  setAdjustment: typeof tilesActions.setAdjustment;
}

const tileValue = (tile: Tile | null, adjustment: Adjustment) => {
  if (!tile) {
    return false;
  }
  return tile.adjustments[adjustment.name];
};

export const AdjustmentBar: React.FunctionComponent<Props> = ({
  command,
  setAdjustment,
  tile,
}) => {
  return (
    <div>
      <div>{command.name}</div>
      {command.adjustments &&
        command.adjustments.map(adjustment => {
          const value = tileValue(tile, adjustment) || adjustment.initialValue;
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
  );
};
