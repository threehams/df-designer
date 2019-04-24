import { useActions } from "react-redux";
import { Button } from ".";
import {
  selectCommands,
  selectCurrentCommand,
} from "../store/reducers/toolReducer";
import { Box } from "./Box";
import { Flex } from "./Flex";
import { toolActions } from "../store/actions";
import { useMemoizedState } from "../lib/useMemoizedState";

export const CommandBar: React.FunctionComponent = () => {
  const { phase, command, commands } = useMemoizedState(state => {
    return {
      phase: state.tool.phase,
      command: selectCurrentCommand(state),
      commands: selectCommands(state, { phase: state.tool.phase }),
    };
  });
  const { setCurrentPhase, setCommand } = useActions(toolActions);
  return (
    <Flex p={2} flexDirection="column" flexWrap="nowrap">
      <Box mb={3}>
        <Button
          block
          onClick={() => setCurrentPhase("dig")}
          active={phase === "dig"}
          data-test="phase"
          data-test-item="dig"
          mb={1}
        >
          Dig
        </Button>
        <Button
          block
          onClick={() => setCurrentPhase("build")}
          active={phase === "build"}
          data-test="phase"
          data-test-item="build"
          mb={1}
        >
          Build
        </Button>
        <Button
          block
          onClick={() => setCurrentPhase("place")}
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
            onClick={() => setCommand(comm.slug)}
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
