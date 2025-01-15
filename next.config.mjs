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
    serverComponentsExternalPackages: ['sharp']
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
  }
};

export default nextConfig;
