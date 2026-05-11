/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    qualities: [90, 75],
    formats: ['image/webp'],
  },
  async redirects() {
    return [
      { source: "/about", destination: "/#about", permanent: false },
      { source: "/host-event", destination: "/private-events", permanent: false },
    ]
  },
}

export default nextConfig
