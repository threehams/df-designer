import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from ".";
import { toolActions } from "../store/actions";
import {
  selectCommands,
  selectCurrentCommand,
} from "../store/reducers/toolReducer";
import { Box } from "./Box";
import { Flex } from "./Flex";

export const CommandBar = () => {
  const phase = useSelector(state => state.tool.phase);
  const command = useSelector(selectCurrentCommand);
  const commands = useSelector(state => {
    return selectCommands(state, { phase: state.tool.phase });
  });
  const dispatch = useDispatch();
  return (
    <Flex p={2} flexDirection="column" flexWrap="nowrap">
      <Box mb={3}>
        <Button
          block
          onClick={() =>
            dispatch(toolActions.setCurrentPhase({ phaseSlug: "dig" }))
          }
          active={phase === "dig"}
          data-test="phase"
          data-test-item="dig"
          mb={1}
        >
          Dig
        </Button>
        <Button
          block
          onClick={() =>
            dispatch(toolActions.setCurrentPhase({ phaseSlug: "build" }))
          }
          active={phase === "build"}
          data-test="phase"
          data-test-item="build"
          mb={1}
        >
          Build
        </Button>
        <Button
          block
          onClick={() =>
            dispatch(toolActions.setCurrentPhase({ phaseSlug: "place" }))
          }
          active={phase === "place"}
          data-test="phase"
          data-test-item="place"
        >
          Place Stockpiles
        </Button>
      </Box>
      <Box mb={3}>
        {commands.map(comm => (
          <Button
            key={comm.slug}
            block
            onClick={() =>
              dispatch(toolActions.setCommand({ commandSlug: comm.slug }))
            }
            active={command.slug === comm.slug}
            data-test="command"
            data-test-item={comm.slug}
            mb={1}
          >
            {comm.name}
          </Button>
        ))}
      </Box>
    </Flex>
  );
};
