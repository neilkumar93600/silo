import type { MetadataRoute } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Authenticated app + auth flows have no reason to be crawled.
      disallow: ["/dashboard", "/login", "/signup", "/forgot-password", "/reset-password"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
