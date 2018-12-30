import { Coords } from "../store/tool";

export const withinCoordinates = (
  start: Coords | null,
  end: Coords | null,
  current: Coords,
) => {
  if (!start || !end) {
    return false;
  }
  return (
    start.x <= current.x &&
    current.x <= end.x &&
    start.y <= current.y &&
    current.y <= end.y
  );
};
