import type { NextConfig } from "next"

const API_URL = process.env.API_URL ?? "http://localhost:4000"

const nextConfig: NextConfig = {
  async rewrites() {
    // Proxy every /api/* call to the Express backend so the browser only
    // ever talks to this app's own origin — keeps the session cookie
    // first-party without CORS/SameSite=None gymnastics. Large file bytes
    // never flow through here: uploads/downloads go straight browser<->S3
    // via presigned URLs.
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
