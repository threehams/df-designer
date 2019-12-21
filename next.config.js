const path = require("path");

module.exports = {
  webpack: config => {
    config.resolve.alias["pixi.js"] = path.resolve(__dirname, "pixi.js");
    config.resolve.alias["pixi.js-stable"] = path.resolve(
      __dirname,
      "node_modules/pixi.js",
    );
    return config;
  },
  typescript: {
    ignoreDevErrors: true,
    ignoreBuildErrors: true,
  },
};
