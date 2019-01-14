/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { connect } from "react-redux";

import { Button, ButtonGroup } from ".";
import { State } from "../store";
import {
  Command,
  Phase,
  PhaseConfig,
  selectCommands,
  selectCurrentCommand,
  selectPhase,
  selectPhases,
  toolActions,
} from "../store/tool";

jsx; // tslint:disable-line

interface Props {
  phase: Phase;
  setPhase: typeof toolActions.setPhase;
  command: Command;
  setCommand: typeof toolActions.setCommand;
  commands: Command[];
  phases: PhaseConfig[];
}

const CommandBarBase: React.FunctionComponent<Props> = ({
  phase,
  setPhase,
  command,
  setCommand,
  commands,
}) => {
  return (
    <aside
      css={css`
        padding: 10px;
        display: flex;
        flex-flow: column nowrap;
      `}
    >
      <ButtonGroup block>
        <Button
          block
          onClick={() => setPhase("dig")}
          active={phase === "dig"}
          data-test="phase-dig"
        >
          Dig
        </Button>
        <Button
          block
          onClick={() => setPhase("build")}
          active={phase === "build"}
          data-test="phase-build"
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
      </ButtonGroup>
      <ButtonGroup block>
        {commands.map(comm => (
          <Button
            key={comm.command}
            block
            onClick={() => setCommand(comm.command)}
            active={command.command === comm.command}
            data-test={`command-${comm.command}`}
          >
            {comm.name}
          </Button>
        ))}
      </ButtonGroup>
    </aside>
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
