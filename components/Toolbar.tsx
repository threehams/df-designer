import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { tilesActions, toolActions } from "../store/actions";
import { selectTool } from "../store/reducers/toolReducer";
import { Button } from "./";
import { Box } from "./Box";
import { Flex } from "./Flex";

export const Toolbar = () => {
  const tool = useSelector(selectTool);
  const undoSteps = useSelector(state => state.tiles.past.length);
  const redoSteps = useSelector(state => state.tiles.future.length);
  const zLevel = useSelector(state => state.tiles.zLevel);
  const dispatch = useDispatch();
  return (
    <Flex p={2}>
      <Box mr={3}>
        <Button onClick={() => dispatch(tilesActions.resetBoard())}>
          Reset
        </Button>
      </Box>
      <Box mr={3}>
        <Button
          disabled={!undoSteps}
          onClick={() => dispatch(tilesActions.undo())}
          mr={1}
        >
          Undo
        </Button>
        <Button
          disabled={!redoSteps}
          onClick={() => dispatch(tilesActions.redo())}
        >
          Redo
        </Button>
      </Box>
      <Box mr={3}>
        <Button
          onClick={() => dispatch(toolActions.setTool({ tool: "select" }))}
          active={tool === "select"}
          mr={1}
        >
          Select
        </Button>
        <Button
          onClick={() => dispatch(toolActions.setTool({ tool: "paint" }))}
          active={tool === "paint"}
          mr={1}
        >
          Paint
        </Button>
        <Button
          onClick={() => dispatch(toolActions.setTool({ tool: "rectangle" }))}
          active={tool === "rectangle"}
          mr={1}
        >
          Paint Rectangle
        </Button>
        <Button
          onClick={() => dispatch(toolActions.setTool({ tool: "erase" }))}
          active={tool === "erase"}
        >
          Erase
        </Button>
      </Box>
      <Flex flexWrap="nowrap" alignItems="center">
        <Button onClick={() => dispatch(tilesActions.zLevelDown())} mr={1}>
          Down Level
        </Button>
        <Box mr={1} title="Z Level">
          {zLevel}
        </Box>
        <Button onClick={() => dispatch(tilesActions.zLevelUp())}>
          Up Level
        </Button>
      </Flex>
    </Flex>
  );
};
