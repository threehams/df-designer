/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";

import { connect } from "react-redux";
import { State } from "../store";
import { Tile, tilesActions } from "../store/tiles";
import {
  Adjustment,
  selectAdjustmentMap,
  selectCommandMap,
} from "../store/tool";
import { Button } from "./Button";

jsx; // tslint:disable-line

interface Props {
  adjustments: Adjustment[];
  name: string;
  setAdjustment: typeof tilesActions.setAdjustment;
  tile: Tile;
}

const tileValue = (tile: Tile | null, adjustment: Adjustment) => {
  if (!tile) {
    return false;
  }
  return tile.adjustments[adjustment.command];
};

export const AdjustmentBarBase: React.FunctionComponent<Props> = ({
  adjustments,
  name,
  setAdjustment,
  tile,
}) => {
  return (
    <div>
      <div data-test="adjustment-bar-item-name">{name}</div>
      {adjustments &&
        adjustments.map(adjustment => {
          const value = tileValue(tile, adjustment);
          return (
            <React.Fragment key={adjustment.command}>
              <label
                key={adjustment.command}
                css={css`
                  display: block;
                `}
              >
                <input
                  type="checkbox"
                  value={adjustment.command}
                  checked={typeof value === "boolean" ? value : false}
                  onChange={() => {
                    return setAdjustment(tile.id, adjustment.command, !value);
                  }}
                  data-test={`adjustment-bar-input-${adjustment.command}`}
                />{" "}
                {adjustment.name}
              </label>
              {adjustment.resize && (
                <div key={adjustment.command}>
                  <Button
                    onClick={() => {
                      setAdjustment(
                        tile.id,
                        adjustment.command,
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
                        adjustment.command,
                        Math.min((value as number) + 1, 12),
                      );
                    }}
                  >
                    +
                  </Button>
                </div>
              )}
            </React.Fragment>
          );
        })}
    </div>
  );
};

interface ExternalProps {
  tile: Tile;
}

export const AdjustmentBar = connect(
  (state: State, { tile }: ExternalProps) => {
    const commandMap = selectCommandMap();
    const adjustmentMap = selectAdjustmentMap();
    return {
      name: commandMap[tile.item!].name,
      adjustments: Object.entries(adjustmentMap)
        .filter(([, command]) => {
          return (
            command.type === "adjustments" && command.requires === tile.item
          );
        })
        .map(([_, adjustment]) => {
          return adjustment as Adjustment;
        }),
    };
  },
  { setAdjustment: tilesActions.setAdjustment },
)(AdjustmentBarBase);
