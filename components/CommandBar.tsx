import { useActionCreators, useSelect } from "@epeli/redux-hooks";
import { Button } from ".";
import { toolActions } from "../store/actions";
import {
  selectCommands,
  selectCurrentCommand,
  selectPhase,
} from "../store/reducers/toolReducer";
import { State } from "../store/types";
import { Box } from "./Box";
import { Flex } from "./Flex";

export const CommandBar: React.FunctionComponent = () => {
  const { phase, command, commands } = useSelect((state: State) => {
    const ph = selectPhase(state);
    return {
      phase: ph,
      command: selectCurrentCommand(state),
      commands: selectCommands(state, { phase: ph }),
    };
  });
  const { setPhase, setCommand } = useActionCreators(toolActions);
  return (
    <Flex p={2} flexDirection="column" flexWrap="nowrap">
      <Box mb={3}>
        <Button
          block
          onClick={() => setPhase("dig")}
          active={phase === "dig"}
          data-test="phase"
          data-test-item="dig"
          mb={1}
        >
          Dig
        </Button>
        <Button
          block
          onClick={() => setPhase("build")}
          active={phase === "build"}
          data-test="phase"
          data-test-item="build"
          mb={1}
        >
          Build
        </Button>
        <Button
          block
          onClick={() => setPhase("place")}
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
