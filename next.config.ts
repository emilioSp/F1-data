import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Tell Next.js not to bundle these — they use Node.js APIs that only work
  // server-side, so Next.js should require() them at runtime instead.
  serverExternalPackages: ['knex', 'pg', 'pg-native'],
  experimental: {
    strictRouteTypes: true,
  },
};

export default nextConfig;
