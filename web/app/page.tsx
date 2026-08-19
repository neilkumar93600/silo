import LandingHero from "@/components/landing/hero"
import LandingMetrics from "@/components/landing/metrics"
import LandingFeatures from "@/components/landing/feature"
import LandingSilvi from "@/components/landing/silvi"
import LandingHowItWorks from "@/components/landing/how"
import LandingHighlights from "@/components/landing/integration"
import LandingFaq from "@/components/landing/faq"
import LandingFooter from "@/components/landing/footer"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

// Only verifiable fields — no price, rating, founding date, or address,
// since none of those are real yet. See the project's SEO findings for why
// "zero-knowledge"/"encrypted" claims are deliberately excluded here too.
const SOFTWARE_APPLICATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Silo",
  description:
    "Silo is a private file sharing app — files stay private by default, then share by link or with one person, revocable anytime.",
  url: SITE_URL,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  featureList: [
    "Private by default — files are visible only to you until shared",
    "Share with one link — toggle a file public to get an unguessable link",
    "Built for big files — uploads stream directly to cloud storage",
    "Silvi — a natural-language assistant for finding, moving, and sharing files",
  ],
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-void-plum text-paper-white font-sans">
      <LandingHero />
      <LandingMetrics />
      <div id="features">
        <LandingFeatures />
      </div>
      <div id="silvi">
        <LandingSilvi />
      </div>
      <div id="how-it-works">
        <LandingHowItWorks />
      </div>
      <LandingHighlights />

      <div id="faq">
        <LandingFaq />
      </div>

      <LandingFooter />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_APPLICATION_JSON_LD) }}
      />
    </div>
  )
}
