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
  outputStandalone: true
};

export default nextConfig;
