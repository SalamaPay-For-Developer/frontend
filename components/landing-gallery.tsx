"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"

const galleryItems = [
  {
    image: "/34979.jpg",
    title: "Mobile Payments",
    category: "Fintech",
  },
  {
    image: "/2150384779.jpg",
    title: "Business Growth",
    category: "Solutions",
  },
  {
    image: "/3263.jpg",
    title: "Secure Wallets",
    category: "Security",
  },
  {
    image: "/2149893741.jpg",
    title: "Digital Invoicing",
    category: "Tools",
  },
  {
    image: "/123077.jpg",
    title: "Merchant Portal",
    category: "Dashboard",
  },
  {
    image: "/12623.jpg",
    title: "Smart Analytics",
    category: "Insights",
  },
  {
    image: "/2147936151.jpg",
    title: "Seamless Checkout",
    category: "Commerce",
  },
]

export function LandingGallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start",
    loop: true,
    dragFree: true
  })

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="max-w-xl">
            <h4 className="text-primary text-xs font-bold uppercase tracking-widest mb-4">Gallery</h4>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Visualizing the Future of Payments
            </h2>
            <p className="text-muted-foreground mt-4">
              Explore how Salamapay is transforming the financial landscape in Tanzania through our modern UI and powerful tools.
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={scrollPrev}
              className="rounded-full size-12"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={scrollNext}
              className="rounded-full size-12"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-5" />
            </Button>
          </div>
        </div>

        <div className="embla" ref={emblaRef}>
          <div className="embla__container flex gap-6">
            {galleryItems.map((item, index) => (
              <div 
                key={index} 
                className="embla__slide flex-[0_0_80%] sm:flex-[0_0_40%] lg:flex-[0_0_30%] min-w-0"
              >
                <div className="group relative aspect-[4/5] rounded-[32px] overflow-hidden border border-border/50 bg-muted">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                  
                  <div className="absolute inset-x-0 bottom-0 p-8 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2 block">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-bold tracking-tight">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
