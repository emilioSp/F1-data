import type { NextConfig } from 'next';
import { ALLOWED_IMAGE_HOSTNAMES } from './lib/images.ts';

const nextConfig: NextConfig = {
  // Tell Next.js not to bundle these — they use Node.js APIs that only work
  // server-side, so Next.js should require() them at runtime instead.
  serverExternalPackages: ['knex', 'pg', 'pg-native'],
  experimental: {
    strictRouteTypes: true,
  },
  images: {
    remotePatterns: ALLOWED_IMAGE_HOSTNAMES.map((hostname) => ({
      protocol: 'https' as const,
      hostname,
    })),
  },
};

export default nextConfig;
