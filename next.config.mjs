/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
    serverActions: true
  }
};

export default nextConfig;
