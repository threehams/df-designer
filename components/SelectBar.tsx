/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { connect } from "react-redux";

import { State } from "../store";
import { Command, selectCommandMap } from "../store/tool";
import { idFromCoordinates } from "../lib/coordinatesFromId";
import { Tile } from "../store/tiles";

jsx; // tslint:disable-line

interface Props {
  command: Command | null;
  tile: Tile | null;
}

const SelectBarBase: React.SFC<Props> = ({ command }) => {
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
              return (
                <div key={command.command}>
                  <label>
                    <input
                      type="checkbox"
                      value={adjustment.name}
                      checked={!!command}
                    />{" "}
                    {adjustment.name}
                  </label>
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
      return { tile: null, command: null };
    }
    const { x, y } = state.tool.selectedItem;
    const tile = state.tiles.data[idFromCoordinates(x, y)];
    if (!tile || !tile.item) {
      return { tile, command: null };
    }
    const commandMap = selectCommandMap();

    return {
      tile,
      command: commandMap[tile.item],
    };
  },
  {},
)(SelectBarBase);
