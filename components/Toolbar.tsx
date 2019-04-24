import { useActions } from "react-redux";
import { selectTool } from "../store/reducers/toolReducer";
import { State } from "../store/types";
import { Button } from "./";
import { Box } from "./Box";
import { Flex } from "./Flex";
import { toolActions, tilesActions } from "../store/actions";
import { useMemoizedState } from "../lib/useMemoizedState";

export const Toolbar: React.FunctionComponent = () => {
  const { tool, undoSteps, redoSteps, zLevel } = useMemoizedState(
    (state: State) => {
      return {
        tool: selectTool(state),
        undoSteps: state.tiles.past.length,
        redoSteps: state.tiles.future.length,
        zLevel: state.tiles.zLevel,
      };
    },
  );
  const {
    redo,
    resetBoard,
    undo,
    setTool,
    zLevelDown,
    zLevelUp,
  } = useActions({ ...toolActions, ...tilesActions });
  return (
    <Flex p={2} data-test="toolbar">
      <Box mr={3}>
        <Button onClick={() => resetBoard()} data-test="reset">
          Reset
        </Button>
      </Box>
      <Box mr={3}>
        <Button
          disabled={!undoSteps}
          data-test="undo"
          onClick={() => undo()}
          mr={1}
        >
          Undo
        </Button>
        <Button disabled={!redoSteps} data-test="redo" onClick={() => redo()}>
          Redo
        </Button>
      </Box>
      <Box mr={3}>
        <Button
          data-test="tool"
          data-test-item="select"
          onClick={() => setTool("select")}
          active={tool === "select"}
          mr={1}
        >
          Select
        </Button>
        <Button
          data-test="tool"
          data-test-item="paint"
          onClick={() => setTool("paint")}
          active={tool === "paint"}
          mr={1}
        >
          Paint
        </Button>
        <Button
          data-test="tool"
          data-test-item="paint-rectangle"
          onClick={() => setTool("rectangle")}
          active={tool === "rectangle"}
          mr={1}
        >
          Paint Rectangle
        </Button>
        <Button
          data-test="tool"
          data-test-item="erase"
          onClick={() => setTool("erase")}
          active={tool === "erase"}
        >
          Erase
        </Button>
      </Box>
      <Flex flexWrap="nowrap" alignItems="center">
        <Button data-test="z-level-down" onClick={() => zLevelDown()} mr={1}>
          Down Level
        </Button>
        <Box mr={1} data-test="z-level">
          {zLevel}
        </Box>
        <Button data-test="z-level-up" onClick={() => zLevelUp()}>
          Up Level
        </Button>
      </Flex>
    </Flex>
  );
};
