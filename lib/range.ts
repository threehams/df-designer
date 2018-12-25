export const range = (min: number, max: number, step: number = 1) => {
  const direction = min < max ? 1 : -1;
  const result = [];
  for (let index = min; index < max; index += step * direction) {
    result.push(index);
  }
  return result;
};
