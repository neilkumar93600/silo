import Link from "next/link"
import { Logo } from "@/components/shared/logo"

const columns = [
  {
    title: "PRODUCT",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Create account", href: "/signup" },
      { label: "Brand & Icons", href: "/brand" },
    ],
  },
  {
    title: "LEGAL",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Acceptable Use", href: "/acceptable-use" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
]

export function PublicFooter() {
  return (
    <footer className="border-t border-lavender-mist bg-void-plum text-paper-white">
      <div className="mx-auto max-w-[1440px] px-6 py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-[18px] font-semibold tracking-[-0.025em] text-paper-white">
              <Logo className="h-5 w-auto shrink-0 text-paper-white" />
              <span className="font-freckle text-[22px] tracking-wide">Silo</span>
            </Link>
            <p className="mt-3 max-w-sm text-[14px] leading-[1.5] text-ash-wisp">
              Dark-first zero-knowledge file storage. Keep what&apos;s yours, share what you choose.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[12px] font-medium tracking-[0.08em] text-ash-wisp uppercase">{col.title}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[14px] text-silver-smoke transition-colors hover:text-laser-violet">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="mt-16 h-[80px] sm:h-[140px] md:h-[200px] w-full select-none overflow-hidden flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="gradient-text font-semibold leading-none tracking-[-0.04em] text-[110px] sm:text-[190px] md:text-[260px]">
            Silo
          </span>
        </div>

        <div className="mt-4 border-t border-lavender-mist/60 pt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-mono text-[11px] tracking-[0.05em] text-ash-wisp">
            Copyright © {new Date().getFullYear()} Silo Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[12px] text-ash-wisp">
            <span>Void Plum Edition</span>
            <span>•</span>
            <span className="text-laser-violet">Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

