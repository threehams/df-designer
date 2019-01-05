/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { connect } from "react-redux";

import { State } from "../store";
import { selectExported, tilesActions } from "../store/tiles";
import { selectTool, Tool, toolActions } from "../store/tool";
import { Button, ButtonGroup } from "./";

jsx; // tslint:disable-line

interface Props {
  undo: typeof tilesActions.undo;
  redo: typeof tilesActions.redo;
  setTool: typeof toolActions.setTool;
  resetBoard: typeof tilesActions.resetBoard;
  tool: Tool;
  undoSteps: number;
  redoSteps: number;
  zLevel: number;
  zLevelDown: typeof tilesActions.zLevelDown;
  zLevelUp: typeof tilesActions.zLevelUp;
}

const ToolbarBase: React.FunctionComponent<Props> = ({
  undo,
  redo,
  resetBoard,
  setTool,
  tool,
  undoSteps,
  redoSteps,
  zLevel,
  zLevelDown,
  zLevelUp,
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
      <ButtonGroup>
        <Button disabled={!undoSteps} onClick={undo}>
          Undo
        </Button>
        <Button disabled={!redoSteps} onClick={redo}>
          Redo
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button onClick={() => setTool("select")} active={tool === "select"}>
          Select
        </Button>
        <Button onClick={() => setTool("paint")} active={tool === "paint"}>
          Paint
        </Button>
        <Button
          onClick={() => setTool("rectangle")}
          active={tool === "rectangle"}
        >
          Paint Rectangle
        </Button>
        <Button onClick={() => setTool("erase")} active={tool === "erase"}>
          Erase
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button onClick={zLevelDown}>Down Level</Button>
        {zLevel}
        <Button onClick={zLevelUp}>Up Level</Button>
      </ButtonGroup>
    </header>
  );
};

export const Toolbar = connect(
  (state: State) => {
    return {
      tool: selectTool(state),
      exported: state.tool.export ? selectExported(state) : null,
      undoSteps: state.tiles.past.length,
      redoSteps: state.tiles.future.length,
      zLevel: state.tiles.zLevel,
    };
  },
  {
    undo: tilesActions.undo,
    redo: tilesActions.redo,
    setTool: toolActions.setTool,
    resetBoard: tilesActions.resetBoard,
    zLevelDown: tilesActions.zLevelDown,
    zLevelUp: tilesActions.zLevelUp,
  },
)(ToolbarBase);
