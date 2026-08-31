import { PublicHeader } from "@/components/marketing/public-header"
import LandingFooter from "@/components/landing/footer"

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream-canvas text-ink-black font-sans">
      <PublicHeader />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <article className="rounded-[20px] border border-lavender-mist bg-eclipse-black p-8 sm:p-12 flex flex-col gap-6 text-[14px] leading-[1.6] text-silver-smoke [&_h1]:text-[32px] [&_h1]:leading-[1.12] [&_h1]:font-semibold [&_h1]:tracking-[-0.04em] [&_h1]:text-ink-black [&_h2]:text-[20px] [&_h2]:font-semibold [&_h2]:tracking-[-0.025em] [&_h2]:text-ink-black [&_h2]:mt-6 [&_p]:text-silver-smoke [&_li]:text-silver-smoke [&_a]:text-laser-violet [&_a]:underline-offset-4 hover:[&_a]:underline">
          {children}
        </article>
      </main>
      <LandingFooter />
    </div>
  )
}

