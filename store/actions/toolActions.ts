import { createAction } from "typesafe-actions";
import { CommandSlug, Io, PhaseSlug, Tool, Coords } from "../types";

export const setTool = createAction("app/tool/SET_TOOL")<{ tool: Tool }>();
export const setCurrentPhase = createAction("app/tool/SET_PHASE")<{
  phaseSlug: PhaseSlug;
}>();
export const setCommand = createAction("app/tool/SET_COMMAND")<{
  commandSlug: CommandSlug;
}>();
export const setIo = createAction("app/tool/SET_IO")<{ io: Io }>();
export const endSelection = createAction("app/tool/END_SELECTION")();
export const startSelection = createAction("app/tool/START_SELECTION")<
  Coords
>();
export const updateSelection = createAction("app/tool/UPDATE_SELECTION")<
  Coords
>();
export const startDrag = createAction("app/tool/START_DRAG")<Coords>();
export const updateDrag = createAction("app/tool/UPDATE_DRAG")<Coords>();
export const cancel = createAction("app/tool/CANCEL")();
