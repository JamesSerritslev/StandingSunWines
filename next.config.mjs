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
}

export default nextConfig
