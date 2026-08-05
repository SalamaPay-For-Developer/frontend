import { LandingHeader } from "@/components/landing-header"
import { LandingHero } from "@/components/landing-hero"
import { LandingFeatures } from "@/components/landing-features"
import { LandingIntegration } from "@/components/landing-integration"
import { LandingFAQ } from "@/components/landing-faq"
import { LandingGallery } from "@/components/landing-gallery"
import { LandingFooter } from "@/components/landing-footer"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <LandingGallery />
        <LandingFeatures />
        <LandingIntegration />
        <LandingFAQ />
      </main>
      <LandingFooter />
    </div>
  )
}





