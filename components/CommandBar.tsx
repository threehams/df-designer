/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { connect } from "react-redux";

import { State } from "../store";
import {
  toolActions,
  selectPhase,
  selectCommand,
  selectPhases,
  selectCommands,
  CommandConfig,
  Phase,
  Command,
  PhaseConfig,
} from "../store/tool";
import { Button, ButtonGroup } from ".";

jsx; // tslint:disable-line

interface Props {
  phase: Phase;
  setPhase: typeof toolActions.setPhase;
  command: Command | null;
  setCommand: typeof toolActions.setCommand;
  commands: CommandConfig[];
  phases: PhaseConfig[];
}

const CommandBarBase: React.SFC<Props> = ({
  phase,
  setPhase,
  command,
  setCommand,
  commands,
  phases,
}) => {
  return (
    <aside
      css={css`
        padding: 10px;
        display: flex;
        flex-flow: column nowrap;
      `}
    >
      <ButtonGroup block={true}>
        {phases.map(ph => (
          <Button
            key={ph.phase}
            block={true}
            onClick={() => setPhase(ph.phase)}
            active={phase === ph.phase}
          >
            {ph.name}
          </Button>
        ))}
      </ButtonGroup>
      <ButtonGroup block={true}>
        {commands.map(comm => (
          <Button
            key={comm.command}
            block={true}
            onClick={() => setCommand(comm.command)}
            active={command === comm.command}
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
      command: selectCommand(state),
      phases: selectPhases(),
      commands: selectCommands(state, { phase }),
    };
  },
  {
    setPhase: toolActions.setPhase,
    setCommand: toolActions.setCommand,
  },
)(CommandBarBase);
