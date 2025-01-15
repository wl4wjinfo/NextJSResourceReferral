/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: process.env.NODE_ENV === 'production',
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
            value: [
              "default-src 'self'",
              "connect-src 'self' https://*.googleapis.com https://*.google.com",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.googleapis.com https://*.google.com",
              "style-src 'self' 'unsafe-inline' https://*.googleapis.com",
              "img-src 'self' data: https://*.googleapis.com https://*.gstatic.com https://*.google.com",
              "font-src 'self' data: https://*.gstatic.com"
            ].join('; ')
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: "geolocation=self, camera=(), microphone=(), payment=()"
          }
        ]
      }
    ];
  },
  experimental: {
    serverActions: true
  },
  output: 'standalone'
};

module.exports = nextConfig;
