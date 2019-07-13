import React from "react";
import {
  selectCommandMap,
  selectAdjustmentMap,
} from "../store/reducers/toolReducer";
import { Adjustment, Tile } from "../store/types";
import { Button, Label } from "./";
import { Box } from "./Box";
import { tilesActions } from "../store/actions";
import { useMemoizedState } from "../lib/useMemoizedState";
import { useDispatch } from "react-redux";

interface Props {
  tile: Tile;
}

const tileValue = (tile: Tile | undefined, adjustment: Adjustment) => {
  if (!tile) {
    return false;
  }
  return tile.adjustments[adjustment.slug];
};

export const AdjustmentBar: React.FunctionComponent<Props> = ({ tile }) => {
  const { name, adjustments } = useMemoizedState(_ => {
    const commandMap = selectCommandMap();
    const adjustmentMap = selectAdjustmentMap();

    return {
      name: commandMap[tile.item!].name,
      adjustments: Object.values(adjustmentMap).filter(adjustment => {
        return adjustment.requires === tile.item;
      }),
    };
  });
  return (
    <Box>
      <Box data-test="adjustment-bar-item-name">{name}</Box>
      {adjustments &&
        adjustments.map(adjustment => {
          const value = tileValue(tile, adjustment);
          if (adjustment.type === "resize") {
            const numberValue = value as number;
            return (
              <ResizeInput
                key={adjustment.slug}
                value={numberValue}
                adjustment={adjustment}
                tile={tile}
              />
            );
          }
          const selectValue = value as string;
          return (
            <SelectInput
              key={adjustment.slug}
              value={selectValue}
              adjustment={adjustment}
              tile={tile}
            />
          );
        })}
    </Box>
  );
};

interface ResizeInputProps {
  adjustment: Adjustment;
  value: number | undefined;
  tile: Tile;
}
const ResizeInput: React.FunctionComponent<ResizeInputProps> = ({
  adjustment,
  value,
  tile,
}) => {
  const dispatch = useDispatch();
  return (
    <React.Fragment key={adjustment.slug}>
      <Label display="block">
        <input
          type="checkbox"
          value={adjustment.slug}
          checked={!!value}
          onChange={() => {
            dispatch(
              tilesActions.setAdjustment(
                tile.id,
                adjustment.slug,
                value ? 0 : 3,
              ),
            );
          }}
          data-test="adjustment-bar-check"
          data-test-item={adjustment.slug}
        />{" "}
        {adjustment.name}
      </Label>
      {value && (
        <Box>
          <Button
            data-test="adjustment-bar-decrement"
            data-test-item={adjustment.slug}
            onClick={() => {
              dispatch(
                tilesActions.setAdjustment(
                  tile.id,
                  adjustment.slug,
                  Math.max(value - 1, 1),
                ),
              );
            }}
          >
            -
          </Button>{" "}
          {value}{" "}
          <Button
            data-test="adjustment-bar-increment"
            data-test-item={adjustment.slug}
            onClick={() => {
              dispatch(
                tilesActions.setAdjustment(
                  tile.id,
                  adjustment.slug,
                  Math.min(value + 1, 12),
                ),
              );
            }}
          >
            +
          </Button>
        </Box>
      )}
    </React.Fragment>
  );
};

interface SelectInputProps {
  adjustment: Adjustment;
  value: string | undefined;
  tile: Tile;
}
const SelectInput: React.FunctionComponent<SelectInputProps> = ({
  adjustment,
  value,
  tile,
}) => {
  const dispatch = useDispatch();
  return (
    <Label key={adjustment.slug} display="block">
      {adjustment.name}
      <select
        value={value || ""}
        onChange={event => {
          dispatch(
            tilesActions.setAdjustment(
              tile.id,
              adjustment.slug,
              event.target.value,
            ),
          );
        }}
        data-test="adjustment-bar-check"
        data-test-item={adjustment.slug}
      >
        <option value="1">1</option>
        <option value="2">2</option>
      </select>
    </Label>
  );
};
