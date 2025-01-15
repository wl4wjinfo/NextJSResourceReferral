/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  distDir: '.next',
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: process.env.NODE_ENV === 'production',
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.googleapis.com https://*.gstatic.com https://images.unsplash.com; connect-src 'self' https://*.googleapis.com; frame-src 'self' https://accounts.google.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
