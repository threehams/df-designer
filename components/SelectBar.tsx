/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { connect } from "react-redux";

import { State } from "../store";
import { selectCurrentCommand, Command } from "../store/tool";

jsx; // tslint:disable-line

interface Props {
  item: Command;
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
    const command = selectCurrentCommand(state);
    return {};
  },
  {},
)(SelectBarBase);
