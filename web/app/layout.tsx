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
  title: {
    default: "Private File Sharing App That Stays Private | Silo",
    template: "%s | Silo",
  },
  description:
    "Silo is a private file sharing app — files stay private by default, then share by link or with one person, revocable anytime. Try it free.",
  openGraph: {
    type: "website",
    siteName: "Silo",
    title: "Silo — Keep What's Yours, Share What You Choose",
    description:
      "Upload your files, keep them private by default, and share exactly the way you want — a public link or a direct grant to one person. Simple, fast, yours.",
  },
  twitter: {
    card: "summary",
    title: "Silo — Keep What's Yours, Share What You Choose",
    description:
      "Upload your files, keep them private by default, and share exactly the way you want — a public link or a direct grant to one person.",
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
      <body className="bg-void-plum text-paper-white font-sans selection:bg-laser-violet selection:text-white">
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

