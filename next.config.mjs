/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nguoihoc.neu.edu.vn',
        pathname: '/static/media/**',
      },
    ],
  },
}

export default nextConfig
