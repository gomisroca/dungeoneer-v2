import { env } from './src/env.js';

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.js');

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    swcPlugins: [
      [
        '@preact-signals/safe-react/swc',
        {
          mode: 'auto',
        },
      ],
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: env.NEXT_PUBLIC_IMAGE_PROXY_HOSTNAME,
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default config;
