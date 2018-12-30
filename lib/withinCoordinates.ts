import { Coordinates } from "../store/tool";

export const withinCoordinates = (
  start: Coordinates | null,
  end: Coordinates | null,
  current: Coordinates,
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
