import { range } from "lodash";
import { Coords, SelectedCoords } from "../store/types";

export const fromId = (id: string) => {
  const [x, y] = id.split(",");
  return { x: +x, y: +y };
};

export const toId = (x: number, y: number) => {
  return `${x},${y}`;
};

export const expand = (selection: SelectedCoords, amount: number) => {
  return {
    startX: Math.max(selection.startX - amount, 0),
    startY: Math.max(selection.startY - amount, 0),
    endX: selection.endX + amount,
    endY: selection.endY + amount,
  };
};

export const offset = (selection: SelectedCoords, offsetCoords: Coords) => {
  return {
    startX: selection.startX + offsetCoords.x,
    startY: selection.startY + offsetCoords.y,
    endX: selection.endX + offsetCoords.x,
    endY: selection.endY + offsetCoords.y,
  };
};

export const within = (
  selection: SelectedCoords | undefined,
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

export const match = (
  previous: Coords | undefined,
  current: Coords | undefined,
) => {
  if (!current || !previous) {
    return false;
  }
  return previous.x === current.x && previous.y === current.y;
};

type Mapper = (coords: { x: number; y: number; id: string }) => void;
export const each = (selection: SelectedCoords, func: Mapper) => {
  for (const x of range(selection.startX, selection.endX + 1)) {
    for (const y of range(selection.startY, selection.endY + 1)) {
      const id = toId(x, y);
      func({ x, y, id });
    }
  }
};

export const neighborIds = (
  coords: Coords,
  offsets: Partial<SelectedCoords> = {},
) => {
  return range(offsets.startY ?? -1, (offsets.endY ?? 1) + 1).flatMap(y => {
    return range(offsets.startX ?? -1, (offsets.endX ?? 1) + 1).flatMap(x => {
      return toId(coords.x + x, coords.y + y);
    });
  });
};
