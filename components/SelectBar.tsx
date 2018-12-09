/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { connect } from "react-redux";

import { State } from "../store";
import { Command, selectCommandMap } from "../store/tool";
import { idFromCoordinates } from "../lib/coordinatesFromId";

jsx; // tslint:disable-line

interface Props {
  command: Command | null;
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
      return { command: null };
    }
    const commandMap = selectCommandMap();
    const { x, y } = state.tool.selectedItem;
    const commands = state.tiles.data[idFromCoordinates(x, y)];
    const command = commands.find(comm => commandMap[comm].phase !== "dig");
    return {
      command: command ? commandMap[command] : null,
    };
  },
  {},
)(SelectBarBase);
