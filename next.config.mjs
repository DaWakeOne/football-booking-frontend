/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore build errors
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable image optimization
  images: {
    unoptimized: true,
  },
  // Ensure we have a proper output
  output: 'standalone',
}

export default nextConfig
