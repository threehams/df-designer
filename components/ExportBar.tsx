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
import { selectExported } from "../store/tiles";

jsx; // tslint:disable-line

interface Props {
  exported: { [Key in Phase]: string } | null;
  io: Io | null;
  setIo: typeof toolActions.setIo;
  phases: PhaseConfig[];
}

const download = (filename: string, text: string) => {
  const element = document.createElement("a");
  element.href = "data:text/plain;charset=utf-8," + encodeURIComponent(text);
  element.download = filename;
  element.click();
};

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
        <Button block onClick={() => setIo("import")} active={io === "import"}>
          Import
        </Button>
        <Button block onClick={() => setIo("export")} active={io === "export"}>
          Export
        </Button>
      </ButtonGroup>
      {io === "export" && exported && (
        <React.Fragment>
          {Object.entries(exported).map(([phase, csv]) => (
            <React.Fragment key={phase}>
              <label>{phase}</label>

              <textarea
                css={css`
                  display: block;
                  width: 100%;
                `}
                rows={20}
                key={phase}
                value={csv}
                onChange={() => {
                  // readonly input
                }}
              />
            </React.Fragment>
          ))}
          <Button
            color="primary"
            onClick={() => {
              Object.entries(exported).forEach(([phase, csv]) => {
                download(`blueprint-${phase}`, csv);
              });
            }}
          >
            Download All
          </Button>
        </React.Fragment>
      )}

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
