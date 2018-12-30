/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { connect } from "react-redux";

import { idFromCoordinates } from "../lib/coordinatesFromId";
import { State } from "../store";
import { Tile, tilesActions } from "../store/tiles";
import { Command, selectCommandMap, selectSelection } from "../store/tool";
import { AdjustmentBar } from "./AdjustmentBar";
import { MultiSelectBar } from "./MultiSelectBar";

jsx; // tslint:disable-line

interface Props {
  command: Command | null;
  flipSelection: (direction: "horizontal" | "vertical") => any;
  multiSelect: boolean;
  setAdjustment: typeof tilesActions.setAdjustment;
  tile: Tile | null;
}

const SelectBarBase: React.FunctionComponent<Props> = ({
  command,
  multiSelect,
  flipSelection,
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
      {tile && !command && <div>No item selected.</div>}
      {command && tile && (
        <AdjustmentBar
          command={command}
          tile={tile}
          setAdjustment={setAdjustment}
        />
      )}
      {multiSelect && <MultiSelectBar flipSelection={flipSelection} />}
    </aside>
  );
};

export const SelectBar = connect(
  (state: State) => {
    const { command, tile, multiSelect } = selectSelectedTile(state);

    return {
      command,
      multiSelect,
      tile,
    };
  },
  {
    setAdjustment: tilesActions.setAdjustment,
    flipSelection: tilesActions.flipSelection,
  },
)(SelectBarBase);

// probably a sign that the ducks don't make a lot of sense yet
const selectSelectedTile = (state: State) => {
  const selection = selectSelection(state);
  if (!selection) {
    return {
      command: null,
      multiSelect: false,
      tile: null,
    };
  }
  const commandMap = selectCommandMap();

  if (
    selection.startX !== selection.endX ||
    selection.startY !== selection.endY
  ) {
    return {
      command: null,
      multiSelect: true,
      tile: null,
    };
  }
  const id = idFromCoordinates(selection.startX, selection.startY);
  const tile = state.tiles.data[id] || null;
  return {
    command: tile && tile.item ? commandMap[tile.item] : null,
    tile,
    multiSelect: false,
  };
};
