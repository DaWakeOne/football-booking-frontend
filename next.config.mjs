/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static generation
  staticPageGenerationTimeout: 1000,
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
  }
}

export default nextConfig
