/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@taurus-ai/core', '@opencode-ai/sdk'],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.API_URL || 'http://localhost:3001',
  },
};

module.exports = nextConfig;
