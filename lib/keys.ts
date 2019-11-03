export const keys = Object.keys as <T>(o: T) => Array<Extract<keyof T, string>>;
