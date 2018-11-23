/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { connect } from "react-redux";

import { State } from "../store";
import * as tilesActions from "../store/tiles/actions";
import { Tool } from "../store/tool";
import * as toolActions from "../store/tool/actions";
import { Button } from "./";

jsx; // tslint:disable-line

interface Props {
  undo: typeof tilesActions.undo;
  redo: typeof tilesActions.redo;
  setTool: typeof toolActions.setTool;
  tool: Tool;
}

const ToolbarBase: React.SFC<Props> = ({ undo, redo, setTool, tool }) => {
  return (
    <header
      css={css`
        padding: 10px 0;
        display: flex;
      `}
    >
      <ButtonGroup
        css={css`
          margin-right: 15px;
        `}
      >
        <Button onClick={undo}>&lt;</Button>
        <Button onClick={redo}>&gt;</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button onClick={() => setTool("paint")} active={tool === "paint"}>
          Paint
        </Button>
        <Button onClick={() => setTool("erase")} active={tool === "erase"}>
          Erase
        </Button>
      </ButtonGroup>
    </header>
  );
};

interface ButtonGroupProps {
  className?: string;
}
const ButtonGroup: React.SFC<ButtonGroupProps> = ({ children, className }) => {
  return (
    <div
      className={className}
      css={css`
        & > * + * {
          margin-left: 5px;
        }
      `}
    >
      {children}
    </div>
  );
};

export const Toolbar = connect(
  (state: State) => {
    return {
      tool: state.tool,
    };
  },
  {
    undo: tilesActions.undo,
    redo: tilesActions.redo,
    setTool: toolActions.setTool,
  },
)(ToolbarBase);
