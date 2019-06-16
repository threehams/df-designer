export const entries = Object.entries as <
  T extends { [key: string]: any },
  K extends keyof T
>(
  o: T,
) => readonly [keyof T, T[K]][];
