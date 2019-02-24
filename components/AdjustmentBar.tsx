import React from "react";
import { connect } from "react-redux";
import { tilesActions } from "../store/actions";
import {
  selectAdjustmentMap,
  selectCommandMap,
} from "../store/reducers/toolReducer";
import { Adjustment, CommandSlug, State, Tile } from "../store/types";
import { Button, Label } from "./";

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
  return tile.adjustments[adjustment.slug];
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
                key={adjustment.slug}
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
              key={adjustment.slug}
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
    <React.Fragment key={adjustment.slug}>
      <Label display="block">
        <input
          type="checkbox"
          value={adjustment.slug}
          checked={!!value}
          onChange={() => {
            return setAdjustment(tile.id, adjustment.slug, value ? 0 : 3);
          }}
          data-test="adjustment-bar-check"
          data-test-item={adjustment.slug}
        />{" "}
        {adjustment.name}
      </Label>
      {value && (
        <div>
          <Button
            data-test="adjustment-bar-decrement"
            data-test-item={adjustment.slug}
            onClick={() => {
              setAdjustment(tile.id, adjustment.slug, Math.max(value - 1, 1));
            }}
          >
            -
          </Button>{" "}
          {value}{" "}
          <Button
            data-test="adjustment-bar-increment"
            data-test-item={adjustment.slug}
            onClick={() => {
              setAdjustment(tile.id, adjustment.slug, Math.min(value + 1, 12));
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
    <Label key={adjustment.slug} display="block">
      {adjustment.name}
      <select
        value={value || ""}
        onChange={event => {
          return setAdjustment(tile.id, adjustment.slug, event.target.value);
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

interface ExternalProps {
  tile: Tile;
}

export const AdjustmentBar = connect(
  (state: State, { tile }: ExternalProps) => {
    const commandMap = selectCommandMap();
    const adjustments = selectAdjustments(state, { item: tile.item });
    return {
      name: commandMap[tile.item!].name,
      adjustments,
    };
  },
  { setAdjustment: tilesActions.setAdjustment },
)(AdjustmentBarBase);

interface SelectAdjustmentProps {
  item: CommandSlug | null;
}

const selectAdjustments = (_: State, props: SelectAdjustmentProps) => {
  const adjustmentMap = selectAdjustmentMap();
  return Object.values(adjustmentMap).filter(adjustment => {
    return adjustment.requires === props.item;
  });
};
