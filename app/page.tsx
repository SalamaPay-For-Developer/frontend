import { LandingHeader } from "@/components/landing-header"
import { LandingHero } from "@/components/landing-hero"
import { LandingFeatures } from "@/components/landing-features"
import { LandingIntegration } from "@/components/landing-integration"
import { LandingGallery } from "@/components/landing-gallery"
import { LandingFAQ } from "@/components/landing-faq"
import { LandingFooter } from "@/components/landing-footer"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingIntegration />
        <LandingGallery />
        <LandingFAQ />
      </main>
      <LandingFooter />
    </div>
  )
}

