/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { connect } from "react-redux";

import { redo, selectTool, State, undo } from "../state/store";
import { Button } from "./";

jsx; // tslint:disable-line

interface Props {
  undo: typeof undo;
  redo: typeof redo;
  selectTool: typeof selectTool;
}

const ToolbarBase: React.SFC<Props> = ({ undo, redo, selectTool, tool }) => {
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
        <Button onClick={() => selectTool("paint")} active={tool === "paint"}>
          Paint
        </Button>
        <Button
          onClick={() => selectTool("rectangle")}
          active={tool === "rectangle"}
        >
          Rect
        </Button>
        <Button onClick={() => selectTool("erase")} active={tool === "erase"}>
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
  { undo, redo, selectTool },
)(ToolbarBase);
