/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // TypeScript configuration
  typescript: {
    // Enable type checking during build
    ignoreBuildErrors: false,
    // Enable type checking in development
    tsconfigPath: './tsconfig.json',
  },
  
  // ESLint configuration
  eslint: {
    // Enable ESLint during builds
    ignoreDuringBuilds: false,
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Add custom webpack configuration here if needed
    return config;
  },
  
  // Static export configuration
  output: 'export',
  
  // Image optimization
  images: {
    unoptimized: true, // Required for static exports
  },
  
  // Enable source maps in production
  productionBrowserSourceMaps: true,
};

module.exports = nextConfig;
