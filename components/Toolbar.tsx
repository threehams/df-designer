import {
  useReduxDispatch,
  useReduxState,
} from "@mrwolfz/react-redux-hooks-poc";
import {
  redo,
  resetBoard,
  undo,
  zLevelDown,
  zLevelUp,
} from "../store/actions/tilesActions";
import { setTool } from "../store/actions/toolActions";
import { selectTool } from "../store/reducers/toolReducer";
import { State } from "../store/types";
import { Button } from "./";
import { Box } from "./Box";
import { Flex } from "./Flex";

export const Toolbar: React.FunctionComponent = () => {
  const { tool, undoSteps, redoSteps, zLevel } = useReduxState(
    (state: State) => {
      return {
        tool: selectTool(state),
        undoSteps: state.tiles.past.length,
        redoSteps: state.tiles.future.length,
        zLevel: state.tiles.zLevel,
      };
    },
  );
  const dispatch = useReduxDispatch();
  return (
    <Flex p={2} data-test="toolbar">
      <Box mr={3}>
        <Button onClick={() => dispatch(resetBoard())} data-test="reset">
          Reset
        </Button>
      </Box>
      <Box mr={3}>
        <Button
          disabled={!undoSteps}
          data-test="undo"
          onClick={() => dispatch(undo())}
          mr={1}
        >
          Undo
        </Button>
        <Button
          disabled={!redoSteps}
          data-test="redo"
          onClick={() => dispatch(redo())}
        >
          Redo
        </Button>
      </Box>
      <Box mr={3}>
        <Button
          data-test="tool"
          data-test-item="select"
          onClick={() => dispatch(setTool("select"))}
          active={tool === "select"}
          mr={1}
        >
          Select
        </Button>
        <Button
          data-test="tool"
          data-test-item="paint"
          onClick={() => dispatch(setTool("paint"))}
          active={tool === "paint"}
          mr={1}
        >
          Paint
        </Button>
        <Button
          data-test="tool"
          data-test-item="paint-rectangle"
          onClick={() => dispatch(setTool("rectangle"))}
          active={tool === "rectangle"}
          mr={1}
        >
          Paint Rectangle
        </Button>
        <Button
          data-test="tool"
          data-test-item="erase"
          onClick={() => dispatch(setTool("erase"))}
          active={tool === "erase"}
        >
          Erase
        </Button>
      </Box>
      <Flex flexWrap="nowrap" alignItems="center">
        <Button
          data-test="z-level-down"
          onClick={() => dispatch(zLevelDown())}
          mr={1}
        >
          Down Level
        </Button>
        <Box mr={1} data-test="z-level">
          {zLevel}
        </Box>
        <Button data-test="z-level-up" onClick={() => dispatch(zLevelUp())}>
          Up Level
        </Button>
      </Flex>
    </Flex>
  );
};
