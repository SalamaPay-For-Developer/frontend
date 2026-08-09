"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  ArrowRight01Icon, 
  ZapIcon, 
  SecurityCheckIcon,
  Book02Icon,
  Ticket01Icon,
  TaskDone01Icon,
  StarIcon
} from "@hugeicons/core-free-icons"
import Link from "next/link"

const headlines = [
  {
    main: "All Payments",
    highlight: "In One Place",
    sub: "Accept and send payments via M-Pesa, Tigo Pesa, Airtel Money and HaloPesa. App and web — all on Salamapay."
  },
  {
    main: "Manage Your",
    highlight: "Business With Ease",
    sub: "Wallets, reports, staff, and multiple businesses — everything in one place, on mobile or web."
  }
]

function FloatingCard({ 
  icon: Icon, 
  title, 
  price, 
  className,
  delay = "0ms"
}: { 
  icon: any, 
  title: string, 
  price: string, 
  className: string,
  delay?: string 
}) {
  return (
    <div 
      className={`absolute z-20 flex items-center gap-3 p-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-border/50 shadow-xl animate-float hidden lg:flex ${className}`}
      style={{ animationDelay: delay }}
    >
      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 shrink-0">
        <HugeiconsIcon icon={Icon} className="size-5 text-primary" />
      </div>
      <div className="flex flex-col text-left">
        <span className="text-xs font-bold tracking-tight">{title}</span>
        <span className="text-[10px] text-muted-foreground">{price}</span>
      </div>
    </div>
  )
}

export function LandingHero() {
  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % headlines.length)
        setFade(true)
      }, 500)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-20 md:pt-32 md:pb-40">
      {/* Background with modern Dot Matrix */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* The Dots */}
        <div 
          className="absolute inset-0 opacity-[0.25] dark:opacity-[0.35]" 
          style={{ 
            backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)'
          }}
        />
        
        {/* Floating blobs for subtle color */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/10 blur-[120px] rounded-full" />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center min-h-[300px]">
        <div 
          className={`transition-all duration-500 transform ${
            fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6">
            {headlines[index].main} <br className="hidden sm:block" />
            <span className="text-primary italic">{headlines[index].highlight}</span>
          </h1>
          
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl mb-10">
            {headlines[index].sub}
          </p>
        </div>
        
        <div className="flex justify-center animate-in fade-in slide-in-from-bottom duration-1000 delay-500 px-4 sm:px-0">
          <Link href="/auth/register">
            <div className="flex items-center bg-black dark:bg-zinc-900 text-white h-10 sm:h-11 pl-5 pr-1.5 py-1.5 rounded-lg shadow-sm hover:opacity-90 transition-opacity cursor-pointer group w-fit">
              <span className="text-sm font-semibold tracking-tight mr-3">Get Started With Salamapay</span>
              <div className="flex items-center justify-center size-7 sm:size-8 bg-primary rounded-md group-hover:bg-primary/90 transition-colors">
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-4 text-white" />
              </div>
            </div>
          </Link>
        </div>

        {/* App Screenshot - Phone Mockup with Floating Cards */}
        <div className="mt-16 md:mt-24 animate-in fade-in slide-in-from-bottom duration-1000 delay-700">
          <div className="relative mx-auto max-w-sm lg:max-w-none lg:w-[600px]">
            {/* Floating Cards */}
            <FloatingCard 
              icon={Book02Icon} 
              title="Course" 
              price="TZS 50,000" 
              className="-left-12 top-10"
              delay="0s"
            />
            <FloatingCard 
              icon={Ticket01Icon} 
              title="Event tickets" 
              price="TZS 50,000" 
              className="-left-20 bottom-20"
              delay="1s"
            />
            <FloatingCard 
              icon={TaskDone01Icon} 
              title="Subscription" 
              price="TZS 50,000" 
              className="-right-12 top-24"
              delay="2s"
            />
            <FloatingCard 
              icon={StarIcon} 
              title="Coaching services" 
              price="TZS 50,000" 
              className="-right-20 bottom-10"
              delay="3s"
            />

            <div className="relative mx-auto max-w-sm">
              {/* Glow effect behind screenshot */}
              <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-[3rem]" />
              {/* Phone frame */}
              <div className="relative rounded-[2rem] overflow-hidden border-[6px] border-background shadow-2xl bg-background ring-1 ring-border/50">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-background rounded-b-2xl z-10" />
                <img
                  src="/app-screenshot.jpeg"
                  alt="Salamapay Mobile App"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
