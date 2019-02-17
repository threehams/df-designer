try {
  ({ PHASE_PRODUCTION_SERVER } = require("next-server/constants"));
} catch (error) {
  ({ PHASE_PRODUCTION_SERVER } = require("next/constants"));
}

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_PRODUCTION_SERVER) {
    return {
      /* production only config */
    };
  }
  const withSourceMaps = require("@zeit/next-source-maps");
  const withTypescript = require("@zeit/next-typescript");
  const TerserPlugin = require("terser-webpack-plugin");

  return withTypescript({
    webpack(config, options) {
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
  });
};
