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
  
  // Environment variables
  env: {
    // Add environment variables here
  },
  
  // Static export configuration
  output: 'export',
  
  // Trailing slash handling
  trailingSlash: true,
  
  // Build output directory
  distDir: '.next',
  
  // React configuration
  react: {
    useSuspense: true,
    runtime: 'automatic',
  },
  
  // Image optimization
  images: {
    unoptimized: true, // Required for static exports
    domains: [], // Add any image domains here
  },
  
  // Enable source maps in production
  productionBrowserSourceMaps: true,
  
  // Enable React DevTools in production
  reactStrictMode: true,
  
  // Enable webpack 5
  future: {
    webpack5: true,
  },
};

module.exports = nextConfig;
