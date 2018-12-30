import { Coords, SelectedCoords } from "../store/tool";

export const withinCoordinates = (
  selection: SelectedCoords | null,
  current: Coords,
) => {
  if (!selection) {
    return false;
  }
  return (
    selection.startX <= current.x &&
    current.x <= selection.endX &&
    selection.startY <= current.y &&
    current.y <= selection.endY
  );
};
