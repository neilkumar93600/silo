import type { Metadata } from "next"
import { Freckle_Face, Geist, Inter, Martian_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const freckleFace = Freckle_Face({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-freckle-face",
})

const uncutSans = Geist({
  subsets: ["latin"],
  variable: "--font-uncut-sans-variable",
})

const martianMono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-martian-mono",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://silo.app"),
  title: {
    default: "Private File Sharing App That Stays Private | Silo",
    template: "%s | Silo",
  },
  description:
    "Silo is a private file sharing app — files stay private by default, then share by link or with one person, revocable anytime. Try it free.",
  applicationName: "Silo",
  keywords: [
    "private file sharing",
    "secure file transfer",
    "zero knowledge storage",
    "end-to-end encrypted storage",
    "revocable link sharing",
    "Silo cloud",
  ],
  authors: [{ name: "Silo" }],
  creator: "Silo",
  publisher: "Silo",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon-precomposed.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        url: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    type: "website",
    siteName: "Silo",
    title: "Silo — Keep What's Yours, Share What You Choose",
    description:
      "Upload your files, keep them private by default, and share exactly the way you want — a public link or a direct grant to one person. Simple, fast, yours.",
    url: "https://silo.app",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Silo — Private File Sharing App That Stays Private",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Silo — Keep What's Yours, Share What You Choose",
    description:
      "Upload your files, keep them private by default, and share exactly the way you want — a public link or a direct grant to one person.",
    images: ["/twitter-image.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        uncutSans.variable,
        martianMono.variable,
        inter.variable,
        freckleFace.variable,
        "font-sans"
      )}
    >
      <body className="bg-cream-canvas text-ink-black font-sans selection:bg-laser-violet selection:text-white">
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

