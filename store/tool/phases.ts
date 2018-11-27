import { Phase, PhaseConfig } from "./types";

export const phases: { [Key in Phase]: PhaseConfig } = {
  dig: {
    name: "Dig",
    phase: "dig",
  },
  designate: {
    name: "Designate",
    phase: "designate",
  },
  build: {
    name: "Build",
    phase: "build",
  },
  place: {
    name: "Stockpiles",
    phase: "place",
  },
  query: {
    name: "Adjust",
    phase: "query",
  },
};
