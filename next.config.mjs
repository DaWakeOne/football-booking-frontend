/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static generation for specific paths
  experimental: {
    // This tells Next.js not to statically generate these pages during build
    // They will be generated on-demand when requested
    unstable_allowDynamic: [
      '/app/dev-login/**',
      '/components/dev-login-form.tsx',
      '/components/client-dev-login-form.tsx',
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable image optimization for now to simplify deployment
  images: {
    unoptimized: true,
  },
}

export default nextConfig
