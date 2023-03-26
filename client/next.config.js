/** @type {import('next').NextConfig} */
const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = () => {
  return {
    output: "standalone",
    experimental: {
      appDir: true,
    },
  };
};
