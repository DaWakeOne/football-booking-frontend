/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This will allow us to use client components in the app directory
    appDir: true,
  },
  images: {
    domains: ['localhost', 'vercel.app'],
    unoptimized: true,
  },
  // Disable static generation for admin pages
  unstable_staticGeneration: {
    basePath: '/admin',
    excludePattern: ['**/*'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
