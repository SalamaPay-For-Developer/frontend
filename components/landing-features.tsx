"use client"

import { useState, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Link01Icon, 
  Store01Icon, 
  ShoppingCart01Icon,
  Tick02Icon,
  CreditCardIcon,
  SmartPhone01Icon,
  ArrowRight01Icon,
  ChartIcon,
} from "@hugeicons/core-free-icons"

function Typewriter({ texts }: { texts: string[] }) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(150)

  useEffect(() => {
    const handleType = () => {
      const currentFullText = texts[currentIndex % texts.length]
      
      if (!isDeleting) {
        setDisplayText(currentFullText.substring(0, displayText.length + 1))
        setTypingSpeed(100)
        if (displayText === currentFullText) {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        setDisplayText(currentFullText.substring(0, displayText.length - 1))
        setTypingSpeed(50)
        if (displayText === "") {
          setIsDeleting(false)
          setCurrentIndex(currentIndex + 1)
        }
      }
    }

    const timer = setTimeout(handleType, typingSpeed)
    return () => clearTimeout(timer)
  }, [displayText, isDeleting, currentIndex, texts, typingSpeed])

  return (
    <span className="text-primary border-r-2 border-primary animate-pulse pr-1">
      {displayText}
    </span>
  )
}

export function LandingFeatures() {
  return (
    <section id="features" className="py-24 md:py-32 bg-background relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20 mb-6">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            <h4 className="text-primary text-[10px] font-bold uppercase tracking-widest">Salamapay Tools</h4>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] min-h-[1.2em]">
            Everything you need to{" "}
            <Typewriter 
              texts={[
                "accept payments",
                "grow your business",
                "manage your funds",
                "scale with ease"
              ]} 
            />
          </h2>
          <p className="text-muted-foreground text-lg mt-8 max-w-2xl leading-relaxed">
            Payment links, storefronts, and seamless checkouts. Sell products, services, and subscriptions with ease using our professional toolset.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Card 1: Instant Payment Pages (Large) */}
          <div className="lg:col-span-7 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-border overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="p-8 md:p-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-background border border-border text-[10px] font-bold text-primary mb-5 shadow-sm">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                Payment Link
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">Instant payment pages</h3>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
                Create a payment page in seconds. Share your unique link and start receiving payments from anyone, anywhere instantly.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground/70 mb-6">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-background border border-border/50">
                  <span className="size-4 rounded-md bg-primary/10 flex items-center justify-center text-primary text-[8px] font-bold text-white bg-primary">1</span>
                  Visit link
                </span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-3 text-primary/40" />
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-background border border-border/50">
                  <span className="size-4 rounded-md bg-primary/10 flex items-center justify-center text-primary text-[8px] font-bold text-white bg-primary">2</span>
                  Browse products
                </span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-3 text-primary/40" />
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-background border border-border/50">
                  <span className="size-4 rounded-md bg-primary/10 flex items-center justify-center text-primary text-[8px] font-bold text-white bg-primary">3</span>
                  Make payment
                </span>
              </div>
            </div>

            {/* Image */}
            <div className="relative px-8 pb-8 md:px-10 md:pb-10">
              <div className="relative rounded-md overflow-hidden border border-border shadow-md group-hover:shadow-xl transition-all duration-500">
                <img
                  src="/CHECKOUT.png"
                  alt="Salamapay instant payment page checkout"
                  className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Card 2: Storefront */}
            <div className="flex-1 rounded-lg bg-blue-50/50 dark:bg-blue-950/10 border border-border overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="p-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-background border border-border text-[10px] font-bold text-blue-600 mb-4 uppercase shadow-sm">
                  <span className="size-1.5 rounded-full bg-blue-600" />
                  Salamapay Store
                </div>
                <h3 className="text-xl font-bold mb-2 tracking-tight">Business storefront</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Built for merchants moving real volume. Physical goods, digital products, and subscriptions with inventory tracking.
                </p>
              </div>
              <div className="relative px-8 pb-8">
                <div className="relative rounded-md overflow-hidden border border-border shadow-md group-hover:shadow-lg transition-all duration-500">
                  <img
                    src="/snippe-commerce.jpg"
                    alt="Salamapay storefront e-commerce"
                    className="w-full h-44 object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Payment Integration */}
            <div className="flex-1 rounded-lg bg-orange-50/50 dark:bg-orange-950/10 border border-border overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="p-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-background border border-border text-[10px] font-bold text-orange-600 mb-4 uppercase shadow-sm">
                  <span className="size-1.5 rounded-full bg-orange-600" />
                  Salamapay Pay
                </div>
                <h3 className="text-xl font-bold mb-2 tracking-tight">Payment integration</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Sell courses, ebooks, and physical products. Manage inventory, customers, and orders from one unified dashboard.
                </p>
              </div>
              <div className="relative px-8 pb-8">
                <div className="relative rounded-md overflow-hidden border border-border shadow-md group-hover:shadow-lg transition-all duration-500">
                  <img
                    src="/PAYMENT (1).png"
                    alt="Salamapay payment integration"
                    className="w-full h-44 object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Feature Highlights Bar */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Link01Icon, label: "Payment Links", desc: "Share & get paid" },
            { icon: Store01Icon, label: "Storefront", desc: "Sell online" },
            { icon: SmartPhone01Icon, label: "Mobile Money", desc: "M-Pesa, Tigo, Airtel" },
            { icon: ChartIcon, label: "Analytics", desc: "Track growth" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-5 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-border hover:border-primary/50 transition-all duration-300"
            >
              <div className="size-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={item.icon} className="size-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">{item.label}</p>
                <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
