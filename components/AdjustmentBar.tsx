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
          if (adjustment.type === "resize") {
            const numberValue = value as number;
            return (
              <ResizeInput
                key={adjustment.command}
                value={numberValue}
                adjustment={adjustment}
                tile={tile}
                setAdjustment={setAdjustment}
              />
            );
          }
          const selectValue = value as string;
          return (
            <SelectInput
              key={adjustment.command}
              value={selectValue}
              adjustment={adjustment}
              tile={tile}
              setAdjustment={setAdjustment}
            />
          );
        })}
    </div>
  );
};

interface ResizeInputProps {
  adjustment: Adjustment;
  value: number | void;
  tile: Tile;
  setAdjustment: typeof tilesActions.setAdjustment;
}
const ResizeInput: React.FunctionComponent<ResizeInputProps> = ({
  adjustment,
  value,
  tile,
  setAdjustment,
}) => {
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
          checked={!!value}
          onChange={() => {
            return setAdjustment(tile.id, adjustment.command, value ? 0 : 3);
          }}
          data-test={`adjustment-bar-${adjustment.command}-check`}
        />{" "}
        {adjustment.name}
      </label>
      {value && (
        <div key={adjustment.command}>
          <Button
            data-test={`adjustment-bar-${adjustment.command}-decrement`}
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
            data-test={`adjustment-bar-${adjustment.command}-increment`}
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
};

interface SelectInputProps {
  adjustment: Adjustment;
  value: string | null | void;
  tile: Tile;
  setAdjustment: typeof tilesActions.setAdjustment;
}
const SelectInput: React.FunctionComponent<SelectInputProps> = ({
  adjustment,
  value,
  tile,
  setAdjustment,
}) => {
  return (
    <label
      key={adjustment.command}
      css={css`
        display: block;
      `}
    >
      {adjustment.name}
      <select
        value={value || ""}
        onChange={event => {
          return setAdjustment(tile.id, adjustment.command, event.target.value);
        }}
        data-test={`adjustment-bar-${adjustment.command}-check`}
      >
        <option value="1">1</option>
        <option value="2">2</option>
      </select>
    </label>
  );
};

interface ExternalProps {
  tile: Tile;
}

export const AdjustmentBar = connect(
  (_: State, { tile }: ExternalProps) => {
    const commandMap = selectCommandMap();
    const adjustmentMap = selectAdjustmentMap();
    const allAdjustments = Object.values(adjustmentMap)
      .filter(adjustment => {
        return adjustment.requires === tile.item;
      })
      .map(adjustment => {
        return adjustment as Adjustment;
      });
    return {
      name: commandMap[tile.item!].name,
      adjustments: allAdjustments,
    };
  },
  { setAdjustment: tilesActions.setAdjustment },
)(AdjustmentBarBase);
