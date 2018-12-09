/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { connect } from "react-redux";

import { State } from "../store";
import {
  toolActions,
  selectPhase,
  selectCommand,
  selectPhases,
  selectCommands,
  CommandConfig,
  selectCommandMap,
} from "../store/tool";

jsx; // tslint:disable-line

interface Props {
  item: CommandConfig;
}

const SelectBarBase: React.SFC<Props> = ({ item }) => {
  return (
    <aside
      css={css`
        padding: 10px;
        display: flex;
        flex-flow: column nowrap;
      `}
    >
      <div />
    </aside>
  );
};

export const SelectBar = connect(
  (state: State) => {
    const commandMap = selectCommandMap();
    const command = selectCommand(state);
    return {};
  },
  {},
)(SelectBarBase);
