import { createAction } from "typesafe-actions";
import { Tool, Phase, CommandKey, Io } from "./types";

export const setTool = createAction("app/tool/SET_TOOL", resolve => {
  return (tool: Tool) => resolve({ tool });
});
export const setPhase = createAction("app/tool/SET_PHASE", resolve => {
  return (phase: Phase) => resolve({ phase });
});
export const setCommand = createAction("app/tool/SET_COMMAND", resolve => {
  return (command: CommandKey) => resolve({ command });
});
export const setIo = createAction("app/tool/SET_IO", resolve => {
  return (io: Io) => resolve({ io });
});
export const endSelection = createAction("app/tool/END_SELECTION");
export const startSelection = createAction(
  "app/tool/START_SELECTION",
  resolve => {
    return (x: number, y: number) => resolve({ x, y });
  },
);
export const updateSelection = createAction(
  "app/tool/UPDATE_SELECTION",
  resolve => {
    return (x: number, y: number) => resolve({ x, y });
  },
);
export const setSelectedItem = createAction(
  "app/tool/SET_SELECTED_ITEM",
  resolve => {
    return (x: number, y: number) => resolve({ x, y });
  },
);
