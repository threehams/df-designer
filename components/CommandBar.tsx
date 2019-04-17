import {
  useReduxDispatch,
  useReduxState,
} from "@mrwolfz/react-redux-hooks-poc";
import { Button } from ".";
import { setCommand, setPhase } from "../store/actions/toolActions";
import {
  selectCommands,
  selectCurrentCommand,
  selectCommandMap,
} from "../store/reducers/toolReducer";
import { State } from "../store/types";
import { Box } from "./Box";
import { Flex } from "./Flex";
import memoize from "memoize-state";

export const CommandBar: React.FunctionComponent = () => {
  const { phase, command, commands } = useReduxState(
    memoize((state: State) => {
      const commandMap = selectCommandMap();
      return {
        phase: state.tool.phase,
        command: selectCurrentCommand(state),
        commands: Object.values(commandMap).filter(comm =>
          state.tool.phase ? comm.phase === state.tool.phase : true,
        ),
        // commands: selectCommands(state, { phase: state.tool.phase }),
      };
    }),
  );
  const dispatch = useReduxDispatch();
  return (
    <Flex p={2} flexDirection="column" flexWrap="nowrap">
      <Box mb={3}>
        <Button
          block
          onClick={() => dispatch(setPhase("dig"))}
          active={phase === "dig"}
          data-test="phase"
          data-test-item="dig"
          mb={1}
        >
          Dig
        </Button>
        <Button
          block
          onClick={() => dispatch(setPhase("build"))}
          active={phase === "build"}
          data-test="phase"
          data-test-item="build"
          mb={1}
        >
          Build
        </Button>
        <Button
          block
          onClick={() => dispatch(setPhase("place"))}
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
            onClick={() => dispatch(setCommand(comm.slug))}
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
