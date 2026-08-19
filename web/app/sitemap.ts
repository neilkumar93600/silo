import type { MetadataRoute } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

// Only the public marketing/legal/auth-entry pages — the dashboard is
// authenticated and excluded via robots.ts.
const ROUTES = ["/", "/login", "/signup", "/terms", "/privacy", "/acceptable-use", "/cookies"]

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    priority: path === "/" ? 1 : 0.5,
  }))
}
