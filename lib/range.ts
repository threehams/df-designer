export const range = (min: number, max: number) => {
  const step = min < max ? 1 : -1;
  const result = [];
  for (let index = min; index < max; index += step) {
    result.push(index);
  }
  return result;
};
