import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  turbopack: {},
  serverExternalPackages: ['postgres', 'firebase-scrypt', 'bcryptjs', '@sendgrid/mail'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: 'upgrade-insecure-requests' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
