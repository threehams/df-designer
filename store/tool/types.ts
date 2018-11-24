import { commands } from "./commands";
export type Phase = "dig" | "build" | "place" | "query";
export type Tool = "paint" | "erase" | "rectangle";
export interface ToolState {
  readonly current: Tool;
  readonly last: Tool | null;
  readonly export: boolean;
  readonly selectionStart: {
    x: number;
    y: number;
  } | null;
  phase: Phase;
}
export interface CommandConfig {
  requiredTool?: Tool | null;
  width?: number;
  height?: number;
  key: string;
  phase: Phase;
}
export type Command = keyof typeof commands;
