import { connect } from "react-redux";

import { Button } from ".";
import { toolActions } from "../store/actions";
import {
  selectCommands,
  selectCurrentCommand,
  selectPhase,
  selectPhases,
} from "../store/reducers/toolReducer";
import { Command, Phase, PhaseSlug, State } from "../store/types";
import { Box } from "./Box";
import { Flex } from "./Flex";

interface Props {
  phase: PhaseSlug;
  setPhase: typeof toolActions.setPhase;
  command: Command;
  setCommand: typeof toolActions.setCommand;
  commands: Command[];
  phases: Phase[];
}

const CommandBarBase: React.FunctionComponent<Props> = ({
  phase,
  setPhase,
  command,
  setCommand,
  commands,
}) => {
  return (
    <Flex p={2} flexDirection="column" flexWrap="nowrap">
      <Box mb={3}>
        <Button
          block
          onClick={() => setPhase("dig")}
          active={phase === "dig"}
          data-test="phase-dig"
          mb={1}
        >
          Dig
        </Button>
        <Button
          block
          onClick={() => setPhase("build")}
          active={phase === "build"}
          data-test="phase-build"
          mb={1}
        >
          Build
        </Button>
        <Button
          block
          onClick={() => setPhase("place")}
          active={phase === "place"}
          data-test="phase-place"
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
            data-test={`command-${comm.slug}`}
            mb={1}
          >
            {comm.name}
          </Button>
        ))}
      </Box>
    </Flex>
  );
};

export const CommandBar = connect(
  (state: State) => {
    const phase = selectPhase(state);
    return {
      phase,
      command: selectCurrentCommand(state),
      phases: selectPhases(),
      commands: selectCommands(state, { phase }),
    };
  },
  {
    setPhase: toolActions.setPhase,
    setCommand: toolActions.setCommand,
  },
)(CommandBarBase);
