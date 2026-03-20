import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
    ],
  },
  // Ensure trailing slashes are consistent
  trailingSlash: false,
  // Vercel handles this automatically, but explicit for clarity
  poweredByHeader: false,
}

export default nextConfig
