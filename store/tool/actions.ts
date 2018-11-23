import { createAction } from "typesafe-actions";
import { Tool } from "./types";

export const setTool = createAction("tiles/SET_TOOL", resolve => {
  return (tool: Tool) => resolve({ tool });
});
