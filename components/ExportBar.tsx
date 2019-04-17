import {
  useReduxDispatch,
  useReduxState,
} from "@mrwolfz/react-redux-hooks-poc";
import React, { useState } from "react";
import { Button, Flex, Textarea } from ".";
import { importAll } from "../store/actions/tilesActions";
import { setIo } from "../store/actions/toolActions";
import { selectPhases } from "../store/reducers/toolReducer";
import { selectExported } from "../store/selectors";
import { ImportMap, State } from "../store/types";
import memoize from "memoize-state";

const download = (filename: string, text: string) => {
  const element = document.createElement("a");
  element.href = "data:text/plain;charset=utf-8," + encodeURIComponent(text);
  element.download = filename;
  element.click();
};

export const ExportBar: React.FunctionComponent = () => {
  const { io, exported, phases } = useReduxState(
    memoize((state: State) => {
      return {
        io: state.tool.io,
        exported: state.tool.io === "export" ? selectExported(state) : null,
        phases: selectPhases(),
      };
    }),
  );
  const dispatch = useReduxDispatch();
  const [importValue, setImportValue] = useState<ImportMap>({});
  return (
    <Flex p={2} flexDirection="column" flexWrap="nowrap">
      <Flex flexDirection="row" flexWrap="nowrap" alignItems="center">
        <Button
          mr={1}
          block
          data-test="import"
          onClick={() => dispatch(setIo("import"))}
          active={io === "import"}
        >
          Import
        </Button>
        <Button
          block
          data-test="export"
          onClick={() => dispatch(setIo("export"))}
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
                data-test="export-text"
                data-test-item={phase}
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
                  data-test="import-text"
                  data-test-item={phase.slug}
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
            onClick={() => dispatch(importAll(importValue))}
          >
            Import All
          </Button>
        </>
      )}
    </Flex>
  );
};
