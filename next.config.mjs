/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  distDir: '.next',
  generateBuildId: async () => {
    return 'build'
  },
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['sharp', 'neo4j-driver']
  },
  poweredByHeader: false,
  compress: true,
  trailingSlash: false,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Ensure server files are included in the build
  outputFileTracing: true,
  outputStandalone: true,
  // AWS specific settings
  assetPrefix: process.env.NEXT_PUBLIC_SITE_URL,
  basePath: '',
  // Improve production performance
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  // Server configuration
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname
  },
  // Build configuration
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Server-specific webpack config
      config.externals.push({
        'sharp': 'commonjs sharp',
        'neo4j-driver': 'commonjs neo4j-driver'
      })
    }
    return config
  }
};

export default nextConfig;
