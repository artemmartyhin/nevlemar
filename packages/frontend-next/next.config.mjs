import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '95.179.189.214' },
      { protocol: 'https', hostname: 'nevlemar.com' },
    ],
  },
  async rewrites() {
    const api = process.env.INTERNAL_API_URL || 'http://localhost:3001';
    return [
      { source: '/api/:path*', destination: `${api}/:path*` },
      { source: '/uploads/:path*', destination: `${api}/uploads/:path*` },
    ];
  },
};

export default withNextIntl(nextConfig);
