/** @jsx jsx */
import React from "react";
import { useState } from "react";
import { css, jsx } from "@emotion/core";
import { connect } from "react-redux";

import { State } from "../store";
import {
  toolActions,
  Phase,
  Io,
  selectPhases,
  PhaseConfig,
} from "../store/tool";
import { Button, ButtonGroup } from ".";
import { selectExported, tilesActions } from "../store/tiles";

jsx; // tslint:disable-line

interface Props {
  exported: { [Key in Phase]: string } | null;
  io: Io | null;
  setIo: typeof toolActions.setIo;
  phases: PhaseConfig[];
}

export const ExportBarBase: React.SFC<Props> = ({
  exported,
  io,
  setIo,
  phases,
}) => {
  const [importValue, setImportValue] = useState<{ [Key in Phase]?: string }>(
    {},
  );
  return (
    <aside
      css={css`
        padding: 10px;
        display: flex;
        flex-flow: column nowrap;
      `}
    >
      <ButtonGroup
        css={css`
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
        `}
      >
        <Button
          block={true}
          onClick={() => setIo("import")}
          active={io === "import"}
        >
          Import
        </Button>
        <Button
          block={true}
          onClick={() => setIo("export")}
          active={io === "export"}
        >
          Export
        </Button>
      </ButtonGroup>
      {io === "export" &&
        exported &&
        Object.entries(exported).map(([phase, result]) => (
          <React.Fragment key={phase}>
            <label>{phase}</label>

            <textarea
              css={css`
                display: block;
                width: 100%;
              `}
              rows={20}
              key={phase}
              value={result}
              onChange={() => {}}
            />
          </React.Fragment>
        ))}
      {io === "import" &&
        phases.map(phase => {
          return (
            <React.Fragment key={phase.phase}>
              <label>{phase.name}</label>
              <textarea
                css={css`
                  display: block;
                  width: 100%;
                `}
                rows={20}
                value={importValue[phase.phase]}
                onChange={event => {
                  setImportValue({
                    ...importValue,
                    [phase.phase]: event.target.value,
                  });
                }}
              />
            </React.Fragment>
          );
        })}
    </aside>
  );
};

export const ExportBar = connect(
  (state: State) => {
    const io = state.tool.io;
    return {
      io,
      exported: io === "export" ? selectExported(state) : null,
      phases: selectPhases(),
    };
  },
  { setIo: toolActions.setIo },
)(ExportBarBase);
