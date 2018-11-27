/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { connect } from "react-redux";

import { State } from "../store";
import { tilesActions, selectExported } from "../store/tiles";
import { toolActions, selectTool, Tool, Phase } from "../store/tool";
import { Button, ButtonGroup } from "./";

jsx; // tslint:disable-line

interface Props {
  undo: typeof tilesActions.undo;
  redo: typeof tilesActions.redo;
  setTool: typeof toolActions.setTool;
  resetBoard: typeof tilesActions.resetBoard;
  toggleExport: typeof toolActions.toggleExport;
  tool: Tool;
  exported: { [Key in Phase]: string } | null;
}

const ToolbarBase: React.SFC<Props> = ({
  undo,
  redo,
  resetBoard,
  setTool,
  tool,
  toggleExport,
  exported,
}) => {
  return (
    <header
      css={css`
        padding: 10px;
        display: flex;
      `}
    >
      <ButtonGroup>
        <Button onClick={resetBoard}>Reset</Button>
      </ButtonGroup>
      {false && (
        <ButtonGroup>
          <Button onClick={undo}>Undo</Button>
          <Button onClick={redo}>Redo</Button>
        </ButtonGroup>
      )}
      <ButtonGroup>
        <Button onClick={() => setTool("paint")} active={tool === "paint"}>
          Paint
        </Button>
        <Button
          onClick={() => setTool("rectangle")}
          active={tool === "rectangle"}
        >
          Select
        </Button>
        <Button onClick={() => setTool("erase")} active={tool === "erase"}>
          Erase
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button onClick={toggleExport}>Export</Button>
      </ButtonGroup>
      {exported &&
        Object.entries(exported).map(([phase, result]) => (
          <textarea key={phase} value={result} onChange={() => {}} />
        ))}
    </header>
  );
};

export const Toolbar = connect(
  (state: State) => {
    return {
      tool: selectTool(state),
      exported: state.tool.export ? selectExported(state) : null,
    };
  },
  {
    undo: tilesActions.undo,
    redo: tilesActions.redo,
    setTool: toolActions.setTool,
    resetBoard: tilesActions.resetBoard,
    toggleExport: toolActions.toggleExport,
  },
)(ToolbarBase);
