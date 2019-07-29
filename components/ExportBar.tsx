import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Flex, Textarea } from ".";
import { tilesActions, toolActions } from "../store/actions";
import { selectPhases } from "../store/reducers/toolReducer";
import { selectExported } from "../store/selectors";
import { ImportMap } from "../store/types";

const download = (filename: string, text: string) => {
  const element = document.createElement("a");
  element.href = "data:text/plain;charset=utf-8," + encodeURIComponent(text);
  element.download = filename;
  element.click();
};

export const ExportBar: React.FunctionComponent = React.memo(() => {
  const io = useSelector(state => state.tool.io);
  const exported = useSelector(state =>
    state.tool.io === "export" ? selectExported(state) : undefined,
  );
  const phases = useSelector(selectPhases);
  const dispatch = useDispatch();
  const [importValue, setImportValue] = useState<ImportMap>({});
  return (
    <Flex p={2} flexDirection="column" flexWrap="nowrap">
      <Flex flexDirection="row" flexWrap="nowrap" alignItems="center">
        <Button
          mr={1}
          block
          data-test="import"
          onClick={() => dispatch(toolActions.setIo("import"))}
          active={io === "import"}
        >
          Import
        </Button>
        <Button
          block
          data-test="export"
          onClick={() => dispatch(toolActions.setIo("export"))}
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
            onClick={() => dispatch(tilesActions.importAll(importValue))}
          >
            Import All
          </Button>
        </>
      )}
    </Flex>
  );
});
