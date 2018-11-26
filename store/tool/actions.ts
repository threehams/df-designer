import { createAction } from "typesafe-actions";
import { Tool, Phase, Command } from "./types";

export const setTool = createAction("app/tool/SET_TOOL", resolve => {
  return (tool: Tool) => resolve({ tool });
});
export const setPhase = createAction("app/tool/SET_PHASE", resolve => {
  return (phase: Phase) => resolve({ phase });
});
export const setCommand = createAction("app/tool/SET_COMMAND", resolve => {
  return (command: Command) => resolve({ command });
});
export const toggleExport = createAction("app/tool/TOGGLE_EXPORT");
export const endSelection = createAction("app/tool/END_SELECTION");
export const startSelection = createAction(
  "app/tool/START_SELECTION",
  resolve => {
    return (x: number, y: number) => resolve({ x, y });
  },
);
