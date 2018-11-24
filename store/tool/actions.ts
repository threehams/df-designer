import { createAction } from "typesafe-actions";
import { Tool } from "./types";

export const setTool = createAction("tool/SET_TOOL", resolve => {
  return (tool: Tool) => resolve({ tool });
});
export const toggleExport = createAction("tool/TOGGLE_EXPORT");
