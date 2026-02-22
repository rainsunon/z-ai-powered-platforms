/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Proxy API requests to Gateway (when NEXT_PUBLIC_API_BASE_URL is not set)
  // This allows using relative paths that get proxied to http://localhost:8080
  // IMPORTANT: Only match /api/shortlink/* paths, not page routes
  async rewrites() {
    const gatewayUrl = process.env.NEXT_PUBLIC_API_BASE_URL 
      ? new URL(process.env.NEXT_PUBLIC_API_BASE_URL).origin 
      : 'http://localhost:8080'
    
    return [
      {
        // Only rewrite requests that start with /api/shortlink/
        // This ensures page routes like /home are not affected
        source: '/api/shortlink/:path*',
        destination: `${gatewayUrl}/api/shortlink/:path*`,
      },
    ]
  },
};

export default nextConfig;
