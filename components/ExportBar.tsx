import React from "react";
import { useState } from "react";
import { connect } from "react-redux";

import { Button, Flex, Textarea } from ".";
import { State } from "../store";
import { ImportMap, selectExported, tilesActions } from "../store/tiles";
import { Io, Phase, PhaseSlug, selectPhases, toolActions } from "../store/tool";

interface Props {
  exported: { [Key in PhaseSlug]: string } | null;
  importAll: typeof tilesActions.importAll;
  io: Io | null;
  setIo: typeof toolActions.setIo;
  phases: Phase[];
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
    <Flex p={2} flexDirection="column" flexWrap="nowrap">
      <Flex flexDirection="row" flexWrap="nowrap" alignItems="center">
        <Button
          mr={1}
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
      </Flex>
      {io === "export" && exported && (
        <>
          {Object.entries(exported).map(([phase, csv]) => (
            <React.Fragment key={phase}>
              <label>{phase}</label>

              <Textarea
                data-test={`export-text-${phase}`}
                rows={20}
                key={phase}
                value={`#${phase}\n${csv}`}
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
        </>
      )}

      {io === "import" && (
        <>
          {phases.map(phase => {
            return (
              <React.Fragment key={phase.slug}>
                <label>{phase.name}</label>
                <Textarea
                  data-test={`import-text-${phase.slug}`}
                  rows={20}
                  value={importValue[phase.slug]}
                  onChange={event => {
                    setImportValue({
                      ...importValue,
                      [phase.slug]: event.target.value,
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
            Import All
          </Button>
        </>
      )}
    </Flex>
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
