export type Tool = "paint" | "erase";
export interface ToolState {
  readonly current: Tool;
  readonly last: Tool | null;
}
