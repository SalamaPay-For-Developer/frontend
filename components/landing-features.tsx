"use client"

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

export function LandingFeatures() {
  return (
    <section id="features" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            <h4 className="text-primary text-[10px] font-bold uppercase tracking-widest">Salamapay Tools</h4>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15]">
            Everything you need to{" "}
            <span className="text-primary">accept payments</span>{" "}
            and grow your business.
          </h2>
          <p className="text-muted-foreground text-lg mt-6 max-w-2xl">
            Payment links, storefronts, and seamless checkouts. Sell products, services, and subscriptions with ease.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Card 1: Instant Payment Pages (Large) */}
          <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-primary/5 via-primary/5 to-transparent dark:from-primary/10 dark:to-muted/20 border border-border/50 overflow-hidden group">
            <div className="p-8 md:p-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-[10px] font-bold text-primary mb-5 shadow-sm">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                Payment Link
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">Instant payment pages</h3>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
                Create a payment page in seconds. Share your unique salamapay.me link and start receiving payments from anyone, anywhere.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground/70 mb-6">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 border border-border/50">
                  <span className="size-4 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[8px] font-bold">1</span>
                  Visit link
                </span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-3 text-primary/40" />
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 border border-border/50">
                  <span className="size-4 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[8px] font-bold">2</span>
                  Browse products
                </span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-3 text-primary/40" />
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 border border-border/50">
                  <span className="size-4 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[8px] font-bold">3</span>
                  Make payment
                </span>
              </div>
            </div>

            {/* Real Image */}
            <div className="relative px-8 pb-8 md:px-10 md:pb-10">
              <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-xl group-hover:shadow-2xl transition-shadow duration-500">
                <img
                  src="/CHECKOUT.png"
                  alt="Salamapay instant payment page checkout"
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Card 2: Storefront */}
            <div className="flex-1 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-50/30 dark:from-blue-950/20 dark:to-muted/20 border border-border/50 overflow-hidden group">
              <div className="p-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-[10px] font-bold text-blue-600 mb-4 uppercase shadow-sm">
                  <span className="size-1.5 rounded-full bg-blue-600" />
                  Salamapay Store
                </div>
                <h3 className="text-xl font-bold mb-2 tracking-tight">A full storefront for your business</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Built for merchants moving real volume. Physical goods, digital products, and subscriptions.
                </p>
              </div>
              <div className="relative px-8 pb-8">
                <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-lg group-hover:shadow-xl transition-shadow duration-500">
                  <img
                    src="/snippe-commerce.jpg"
                    alt="Salamapay storefront e-commerce"
                    className="w-full h-44 object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent" />
                </div>
              </div>
            </div>

            {/* Card 3: Payment Integration */}
            <div className="flex-1 rounded-3xl bg-gradient-to-br from-orange-50 to-orange-50/30 dark:from-orange-950/20 dark:to-muted/20 border border-border/50 overflow-hidden group">
              <div className="p-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-[10px] font-bold text-orange-600 mb-4 uppercase shadow-sm">
                  <span className="size-1.5 rounded-full bg-orange-600" />
                  Salamapay Pay
                </div>
                <h3 className="text-xl font-bold mb-2 tracking-tight">Payment integration</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Sell courses, ebooks, physical products, and services. Manage inventory, customers, and orders from one dashboard.
                </p>
              </div>
              <div className="relative px-8 pb-8">
                <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-lg group-hover:shadow-xl transition-shadow duration-500">
                  <img
                    src="/PAYMENT (1).png"
                    alt="Salamapay payment integration"
                    className="w-full h-44 object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-600/10 to-transparent" />
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
              className="flex items-center gap-3 p-5 rounded-2xl bg-muted/30 border border-border/30 hover:bg-muted/50 hover:border-border transition-all duration-300"
            >
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
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
