import { Phase, PhaseConfig } from "./types";

export const phases: { [Key in Phase]: PhaseConfig } = {
  dig: {
    name: "Dig",
    phase: "dig",
  },
  build: {
    name: "Build",
    phase: "build",
  },
  place: {
    name: "Place",
    phase: "place",
  },
  query: {
    name: "Query",
    phase: "query",
  },
};
