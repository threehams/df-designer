export {};

declare module "@emotion/react" {
  interface Theme {
    breakpoints: number[];
    fontSizes: number[];
    colors: {
      primary: string;
      secondary: string;
    };
    space: number[];
  }
}
