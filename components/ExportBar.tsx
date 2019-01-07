/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";
import { useState } from "react";
import { connect } from "react-redux";

import { Button, ButtonGroup } from ".";
import { State } from "../store";
import { ImportMap, selectExported, tilesActions } from "../store/tiles";
import {
  Io,
  Phase,
  PhaseConfig,
  selectPhases,
  toolActions,
} from "../store/tool";

jsx; // tslint:disable-line

interface Props {
  exported: { [Key in Phase]: string } | null;
  importAll: typeof tilesActions.importAll;
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

export const ExportBarBase: React.FunctionComponent<Props> = ({
  exported,
  importAll,
  io,
  setIo,
  phases,
}) => {
  const [importValue, setImportValue] = useState<ImportMap>({});
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
          block
          data-test="import"
          onClick={() => setIo("import")}
          active={io === "import"}
        >
          Import
        </Button>
        <Button
          block
          data-test="export"
          onClick={() => setIo("export")}
          active={io === "export"}
        >
          Export
        </Button>
      </ButtonGroup>
      {io === "export" && exported && (
        <React.Fragment>
          {Object.entries(exported).map(([phase, csv]) => (
            <React.Fragment key={phase}>
              <label>{phase}</label>

              <textarea
                data-test={`export-text-${phase}`}
                css={css`
                  display: block;
                  width: 100%;
                `}
                rows={20}
                key={phase}
                value={csv}
                readOnly
              />
            </React.Fragment>
          ))}
          <Button
            data-test="export-download-all"
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

      {io === "import" && (
        <>
          {phases.map(phase => {
            return (
              <React.Fragment key={phase.phase}>
                <label>{phase.name}</label>
                <textarea
                  data-test={`import-text-${phase.phase}`}
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
          <Button
            data-test="import-all"
            color="primary"
            onClick={() => importAll(importValue)}
          >
            Download All
          </Button>
        </>
      )}
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
  {
    importAll: tilesActions.importAll,
    setIo: toolActions.setIo,
  },
)(ExportBarBase);
