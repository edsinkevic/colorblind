/** @type {import('next').NextConfig} */
const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase, { defaultConfig }) => {
  const base = {
    output: "standalone",
    experimental: {
      appDir: true,
    },
  };

  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      ...base,
      env: {
        colorblindServerUrl: process.env.COLORBLIND_SERVER_URL
          ? process.env.COLORBLIND_SERVER_URL
          : "http://localhost:8080",
      },
    };
  }

  return {
    ...base,
    env: {
      colorblindServerUrl: process.env.COLORBLIND_SERVER_URL,
    },
  };
};
