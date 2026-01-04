/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    unoptimized: false,
  },
  // Optimize for production
  swcMinify: true,
  compress: true,
  // Workaround for permission issues on external drives
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // Suppress source map reading errors for node_modules on external drives
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    
    // Add rule to ignore source map errors
    config.ignoreWarnings = [
      { module: /node_modules/ },
      { file: /node_modules/ },
    ];
    
    // Suppress warnings about failed source reads
    config.infrastructureLogging = {
      level: 'error',
    };
    
    return config;
  },
  
  // Disable source maps in development to avoid permission issues
  productionBrowserSourceMaps: false,
  
  // Suppress build errors related to source code reading
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed for Next.js
              "style-src 'self' 'unsafe-inline'", // unsafe-inline needed for Tailwind
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
