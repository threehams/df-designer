export const coordinatesFromId = (id: string) => {
  const [x, y] = id.split(",");
  return { x: parseInt(x), y: parseInt(y) };
};

export const idFromCoordinates = (x: number, y: number) => {
  return `${x},${y}`;
};
