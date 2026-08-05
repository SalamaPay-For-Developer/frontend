"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon, ZapIcon, SecurityCheckIcon } from "@hugeicons/core-free-icons"
import Link from "next/link"

const headlines = [
  {
    main: "Empower Your",
    highlight: "Business",
    sub: "The ultimate digital wallet and payment gateway built for Tanzanians. Manage transactions, pay bills, and grow with ease."
  },
  {
    main: "Accept Every",
    highlight: "Payment",
    sub: "Seamlessly integrate M-Pesa, Tigo Pesa, and Airtel Money into your store. One link, infinite possibilities."
  },
  {
    main: "Secure Your",
    highlight: "Future",
    sub: "World-class encryption for every transaction. Built in Dar es Salaam to serve the builders of modern Africa."
  },
  {
    main: "Scale Your",
    highlight: "Dream",
    sub: "From small merchants to growing enterprises, Salamapay is the revenue engine you need to succeed."
  }
]

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
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Moving Grid */}
        <div className="absolute inset-0 animate-grid-move opacity-[0.03] dark:opacity-[0.05]" 
          style={{ 
            backgroundImage: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(to right, currentColor 1px, transparent 1px)", 
            backgroundSize: "40px 40px" 
          }} 
        />
        
        {/* Floating dots/blobs */}
        <div className="absolute top-1/4 left-1/4 size-64 bg-primary/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 size-96 bg-primary/10 rounded-full blur-[120px] animate-float [animation-delay:2s]" />
        
        {/* Static dots */}
        <div className="absolute inset-0 opacity-[0.1] dark:opacity-[0.2]" 
          style={{ 
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", 
            backgroundSize: "20px 20px" 
          }} 
        />
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
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
          <Link href="/auth/register">
            <Button size="lg" className="h-12 px-8 text-base">
              Get Started for Free
              <HugeiconsIcon icon={ArrowRight01Icon} className="ml-2 size-4" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="h-12 px-8 text-base">
            Watch Demo
          </Button>
        </div>
      </div>
    </section>
  )
}
