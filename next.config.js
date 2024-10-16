/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
        url: 'url/',
        https: 'https-browserify',
        http: 'stream-http',
        zlib: 'browserify-zlib',
      };
    }
    return config;
  },
};

export default config;