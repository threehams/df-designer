import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { tilesActions } from "../store/actions";
import {
  selectAdjustmentMap,
  selectCommandMap,
} from "../store/reducers/toolReducer";
import { Adjustment, Tile } from "../store/types";
import { Button, Label } from "./";
import { Box } from "./Box";

interface Props {
  tile: Tile;
}

const tileValue = (tile: Tile | undefined, adjustment: Adjustment) => {
  if (!tile) {
    return false;
  }
  return tile.adjustments[adjustment.slug];
};

export const AdjustmentBar = ({ tile }: Props) => {
  const commandMap = selectCommandMap();
  const adjustmentMap = selectAdjustmentMap();
  // we implicitly know this is non-null based on it being rendered
  // not great, would be nice to store this with the object?
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const name = commandMap[tile.item!].name;

  const adjustments = useSelector(() => {
    return Object.values(adjustmentMap).filter(adjustment => {
      return adjustment.requires === tile.item;
    });
  }, shallowEqual);
  return (
    <Box data-test="adjustment-bar">
      <Box mb={2}>{name}</Box>
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
const ResizeInput = ({ adjustment, value, tile }: ResizeInputProps) => {
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
              tilesActions.setAdjustment({
                id: tile.id,
                name: adjustment.slug,
                value: value ? 0 : 3,
              }),
            );
          }}
        />{" "}
        {adjustment.name}
      </Label>
      {value && (
        <Box>
          <Button
            aria-label={`Decrement ${adjustment.name} Size`}
            onClick={() => {
              dispatch(
                tilesActions.setAdjustment({
                  id: tile.id,
                  name: adjustment.slug,
                  value: Math.max(value - 1, 1),
                }),
              );
            }}
          >
            -
          </Button>{" "}
          <span title={`${adjustment.name} Size`}>{value} </span>
          <Button
            aria-label={`Increment ${adjustment.name} Size`}
            onClick={() => {
              dispatch(
                tilesActions.setAdjustment({
                  id: tile.id,
                  name: adjustment.slug,
                  value: Math.min(value + 1, 12),
                }),
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
const SelectInput = ({ adjustment, value, tile }: SelectInputProps) => {
  const dispatch = useDispatch();
  return (
    <Label key={adjustment.slug} display="block">
      {adjustment.name}
      <select
        value={value || ""}
        onChange={event => {
          dispatch(
            tilesActions.setAdjustment({
              id: tile.id,
              name: adjustment.slug,
              value: event.target.value,
            }),
          );
        }}
      >
        <option value="1">1</option>
        <option value="2">2</option>
      </select>
    </Label>
  );
};
