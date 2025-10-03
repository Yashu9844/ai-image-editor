/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    allowedDevOrigins: [
      '2b0a32628d1c3b86f0de77e994253e60.serveo.net',
    ],
  },
};

export default config;
