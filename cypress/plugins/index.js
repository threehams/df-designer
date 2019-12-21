// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const webpack = require("@cypress/webpack-preprocessor");

module.exports = on => {
  on("before:browser:launch", (browser = {}, args) => {
    if (browser.name === "chromium") {
      const newArgs = args.filter(arg => arg !== "--disable-gpu");
      newArgs.push("--ignore-gpu-blacklist");
      return newArgs;
    }
  });

  on(
    "file:preprocessor",
    webpack({
      webpackOptions: {
        module: {
          rules: [
            {
              test: /\.tsx?$/,
              exclude: [/node_modules/],
              use: [
                {
                  loader: "babel-loader",
                },
              ],
            },
          ],
        },
        resolve: {
          extensions: [".js", ".ts", ".tsx", ".json"],
        },
      },
    }),
  );
};
