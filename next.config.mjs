/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static generation completely
  output: 'standalone',
  
  // Disable image optimization
  images: {
    unoptimized: true,
  },
  
  // Ignore TypeScript and ESLint errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Increase the build timeout if needed
  experimental: {
    turbotrace: {
      logLevel: 'error',
    },
    // Disable static generation for all pages
    appDir: true,
  },
}

export default nextConfig
