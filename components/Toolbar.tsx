/** @jsx jsx */
import { jsx } from "@emotion/core";
import css from "@emotion/css";
import { connect } from "react-redux";
import { undo, redo, selectTool } from "../state/store";

import { State } from "../state/store";
jsx;

interface Props {
  undo: typeof undo;
  redo: typeof redo;
  selectTool: typeof selectTool;
}

const ToolbarBase: React.SFC<Props> = ({ undo, redo }) => {
  return (
    <header
      css={css`
        padding: 10px 0;
      `}
    >
      <button onClick={undo}>&lt;</button>
      <button
        onClick={redo}
        css={css`
          margin-right: 5px;
        `}
      >
        &gt;
      </button>
      <button onClick={() => selectTool("paint")}>Paint</button>
      <button onClick={() => selectTool("rectangle")}>Rect</button>
      <button onClick={() => selectTool("erase")}>Erase</button>
    </header>
  );
};

export const Toolbar = connect(
  (state: State) => {
    return {};
  },
  { undo, redo, selectTool },
)(ToolbarBase);
