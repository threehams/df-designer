export type Tool = "paint" | "erase" | "rectangle";
export interface ToolState {
  readonly current: Tool;
  readonly last: Tool | null;
  readonly export: boolean;
  readonly selectionStart: {
    x: number;
    y: number;
  } | null;
}
