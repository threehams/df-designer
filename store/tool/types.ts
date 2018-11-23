export type Tool = "paint" | "erase";
export interface ToolState {
  current: Tool;
  last: Tool | null;
}
