/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static generation
  experimental: {
    // This will allow us to use the App Router
    appDir: true,
  },
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
