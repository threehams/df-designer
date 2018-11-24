import { commands } from "./commands";
import { phases } from "./phases";

export type Tool = "paint" | "erase" | "rectangle";
export type Command = keyof typeof commands;
export type Phase = keyof typeof phases;

export interface ToolState {
  readonly current: Tool;
  readonly last: Tool | null;
  readonly export: boolean;
  readonly selectionStart: {
    x: number;
    y: number;
  } | null;
  readonly phase: Phase;
  readonly command: Command | null;
  readonly phases: Phase[];
  readonly commands: CommandConfig[];
}

export interface CommandConfig {
  name: string;
  command: Command;
  requiredTool?: Tool | null;
  width?: number;
  height?: number;
  key: string;
  phase: Phase;
}

export interface PhaseConfig {
  name: string;
  phase: Phase;
}
