import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@youversion/platform-core'],
  outputFileTracingIncludes: {
    '/api/prayer': ['./prayer_request/prompts/**/*'],
  },
  webpack: (config) => {
    // Resolve .js imports to .ts files (prayer_request uses Node ESM .js extensions)
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.js'],
    };
    return config;
  },
};

export default nextConfig;
