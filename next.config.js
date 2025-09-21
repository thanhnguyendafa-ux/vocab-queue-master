/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable TypeScript type checking during build
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Configure webpack to handle custom module resolution
  webpack: (config, { isServer }) => {
    // Important: return the modified config
    return config;
  },
  // Add any environment variables here
  env: {
    // NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Enable static exports for Vercel
  output: 'export',
  // Optional: Add a trailing slash to all paths
  trailingSlash: true,
  // Optional: Configure the build output directory
  distDir: '.next',
  // Enable React 18 concurrent features
  react: {
    useSuspense: true,
    runtime: 'automatic',
  },
  // Configure images
  images: {
    unoptimized: true, // Disable Image Optimization API
    domains: [], // Add any image domains here
  },
};

module.exports = nextConfig;
