module.exports = {
  presets: [
    [
      "@babel/env",
      {
        modules: false,
        useBuiltIns: "usage",
        corejs: 3,
      },
    ],
    "next/babel",
  ],
  plugins: ["emotion"],
  overrides: [
    {
      test: "./server",
      presets: ["@babel/env", "@babel/preset-typescript"],
      plugins: ["import-graphql"],
    },
  ],
};
