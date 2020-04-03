export const template = (string: string) => {
  return string
    .trim()
    .split("\n")
    .map(part => part.trim())
    .join("\n");
};
