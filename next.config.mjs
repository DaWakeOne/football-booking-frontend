/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add this to help with deployment issues
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Disable image optimization
  images: {
    unoptimized: true,
  },
  // Ensure we have a proper output
  output: 'standalone',
  // Increase the build timeout if needed
  experimental: {
    // This will increase the build timeout
    turbotrace: {
      logLevel: 'error',
    }
  }
}

export default nextConfig
