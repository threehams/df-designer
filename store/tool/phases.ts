import { PhaseSlug, Phase } from "./types";

export const phases: { [Key in PhaseSlug]: Phase } = {
  dig: {
    name: "Dig",
    slug: "dig",
  },
  designate: {
    name: "Designate",
    slug: "designate",
  },
  build: {
    name: "Build",
    slug: "build",
  },
  place: {
    name: "Stockpiles",
    slug: "place",
  },
  query: {
    name: "Adjust",
    slug: "query",
  },
};
