/** @type {import("next").NextConfig} */
const { join } = require("path");

module.exports = () => {
  return {
    output: "standalone",
    experimental: {
      appDir: true,
    },
  };
};
