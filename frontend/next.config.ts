import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // This wildcard allows all HTTPS domains
      },
    ],
  },
}

export default nextConfig
