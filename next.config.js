const { PHASE_PRODUCTION_SERVER } = require("next/constants");
module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_PRODUCTION_SERVER) {
    return {
      /* production only config */
    };
  }
  const withTypescript = require("@zeit/next-typescript");
  return withTypescript();
};
