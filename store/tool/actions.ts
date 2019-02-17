import { createAction } from "typesafe-actions";
import { CommandSlug, Io, PhaseSlug, Tool } from "./types";

export const setTool = createAction("app/tool/SET_TOOL", resolve => {
  return (tool: Tool) => resolve({ tool });
});
export const setPhase = createAction("app/tool/SET_PHASE", resolve => {
  return (phaseSlug: PhaseSlug) => resolve({ phaseSlug });
});
export const setCommand = createAction("app/tool/SET_COMMAND", resolve => {
  return (commandSlug: CommandSlug) => resolve({ commandSlug });
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
export const startDrag = createAction("app/tool/START_DRAG", resolve => {
  return (x: number, y: number) => resolve({ x, y });
});
export const updateDrag = createAction("app/tool/UPDATE_DRAG", resolve => {
  return (x: number, y: number) => resolve({ x, y });
});
export const cancel = createAction("app/tool/CANCEL");
