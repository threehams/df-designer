try {
  ({ PHASE_PRODUCTION_SERVER } = require("next-server/constants"));
} catch (error) {
  ({ PHASE_PRODUCTION_SERVER } = require("next/constants"));
}

module.exports = phase => {
  if (phase === PHASE_PRODUCTION_SERVER) {
    return {
      /* production only config */
    };
  }
  const TerserPlugin = require("terser-webpack-plugin");

  return {
    webpack(config) {
      config.devtool = "source-map";
      config.optimization.minimizer = [
        new TerserPlugin({
          parallel: true,
          sourceMap: true,
          cache: true,
          cacheKeys: keys => {
            // path changes per build because we add buildId
            // because the input is already hashed the path is not needed
            delete keys.path;
            return keys;
          },
        }),
      ];
      return config;
    },
  };
};
