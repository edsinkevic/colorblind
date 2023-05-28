/** @type {import("next").NextConfig} */

module.exports = () => {
  return {
    output: "standalone",
    experimental: {
      appDir: true,
    },
  };
};
