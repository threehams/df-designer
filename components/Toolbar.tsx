import { connect } from "react-redux";

import { tilesActions, toolActions } from "../store/actions";
import { selectTool } from "../store/reducers/toolReducer";
import { selectExported } from "../store/selectors";
import { State, Tool } from "../store/types";
import { Button } from "./";
import { Box } from "./Box";
import { Flex } from "./Flex";

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
    <Flex p={2}>
      <Box mr={3}>
        <Button onClick={resetBoard} data-test="reset">
          Reset
        </Button>
      </Box>
      <Box mr={3}>
        <Button disabled={!undoSteps} data-test="undo" onClick={undo} mr={1}>
          Undo
        </Button>
        <Button disabled={!redoSteps} data-test="redo" onClick={redo}>
          Redo
        </Button>
      </Box>
      <Box mr={3}>
        <Button
          data-test="tool-select"
          onClick={() => setTool("select")}
          active={tool === "select"}
          mr={1}
        >
          Select
        </Button>
        <Button
          data-test="tool-paint"
          onClick={() => setTool("paint")}
          active={tool === "paint"}
          mr={1}
        >
          Paint
        </Button>
        <Button
          data-test="tool-paint-rectangle"
          onClick={() => setTool("rectangle")}
          active={tool === "rectangle"}
          mr={1}
        >
          Paint Rectangle
        </Button>
        <Button
          data-test="tool-erase"
          onClick={() => setTool("erase")}
          active={tool === "erase"}
        >
          Erase
        </Button>
      </Box>
      <Flex flexWrap="nowrap" alignItems="center">
        <Button data-test="z-level-down" onClick={zLevelDown} mr={1}>
          Down Level
        </Button>
        <Box mr={1} data-test="z-level">
          {zLevel}
        </Box>
        <Button data-test="z-level-up" onClick={zLevelUp}>
          Up Level
        </Button>
      </Flex>
    </Flex>
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
