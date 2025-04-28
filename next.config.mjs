/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This will allow us to use the App Router
    appDir: true,
  },
  // Exclude certain pages from static generation
  unstable_excludePages: [
    '/dev-login/owner',
    '/dev-login/player',
    '/login',
    '/login/player',
    '/login/owner',
    '/signup',
    '/signup/player',
    '/signup/owner',
    '/setup-profile',
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
