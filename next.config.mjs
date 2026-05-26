/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    qualities: [90, 75],
    formats: ['image/webp'],
    remotePatterns: [
      {
        // Sanity CDN — used by sections that render images from Sanity
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async redirects() {
    return [
      { source: "/about", destination: "/#about", permanent: false },
      { source: "/host-event", destination: "/private-events", permanent: false },
    ]
  },
}

export default nextConfig
