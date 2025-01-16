/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  distDir: '.next',
  images: {
    unoptimized: true,
    domains: ['lh3.googleusercontent.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true
  },
  poweredByHeader: false,
  compress: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '/Users/brianstitt/CascadeProjects/HealthcareReferrals/src',
    };
    return config;
  },
};

export default nextConfig;
