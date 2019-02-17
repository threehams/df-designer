import { connect } from "react-redux";

import { tilesActions } from "../store/actions";
import { selectTile } from "../store/reducers/tilesReducer";
import {
  selectCommandMap,
  selectSelection,
} from "../store/reducers/toolReducer";
import { Command, State, Tile } from "../store/types";
import { AdjustmentBar } from "./AdjustmentBar";
import { Flex } from "./Flex";
import { MultiSelectBar } from "./MultiSelectBar";

interface Props {
  command: Command | null;
  multiSelect: boolean;
  setAdjustment: typeof tilesActions.setAdjustment;
  tile: Tile | null;
}

const SelectBarBase: React.FunctionComponent<Props> = ({
  command,
  multiSelect,
  tile,
}) => {
  return (
    <Flex p={2} flexDirection="column" flexWrap="nowrap">
      {tile && !command && <div>No item selected.</div>}
      {tile && command && <AdjustmentBar tile={tile} />}
      {multiSelect && <MultiSelectBar />}
    </Flex>
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
  const tile =
    selectTile(state, { x: selection.startX, y: selection.startY }) || null;
  return {
    command: tile && tile.item ? commandMap[tile.item] : null,
    tile,
    multiSelect: false,
  };
};
