"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Globe02Icon, 
  CodeIcon, 
  WorkflowSquare01Icon,
  ShoppingBag01Icon
} from "@hugeicons/core-free-icons"

export function LandingIntegration() {
  return (
    <section id="solutions" className="py-24 bg-[#F2F3F2] dark:bg-muted/5">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h4 className="text-primary text-xs font-bold uppercase tracking-widest mb-4">Integration</h4>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight max-w-2xl mx-auto">
            Salamapay Now Speaks Your Language
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Card: Tools Integration */}
          <div className="rounded-[40px] bg-background dark:bg-muted/10 p-10 md:p-12 border border-border/50 overflow-hidden relative group">
            <div className="max-w-xs relative z-10">
              <h3 className="text-2xl font-bold mb-4">Integrate with your favorite tools</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connect seamlessly with popular platforms and services to start accepting payments.
              </p>
            </div>

            {/* Orbiting Icons Visual */}
            <div className="relative h-64 mt-8 flex items-center justify-center">
              {/* Concentric Circles */}
              <div className="absolute border border-primary/10 rounded-full size-32" />
              <div className="absolute border border-primary/10 rounded-full size-56" />
              <div className="absolute border border-primary/10 rounded-full size-80" />
              
              {/* Central Logo */}
              <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 z-10 shadow-sm">
                 <img src="/salamapaylogo.png" alt="Salamapay" className="size-8 object-contain" />
              </div>

              {/* Orbiting Icons (Simplified with CSS) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-10 rounded-full bg-white dark:bg-muted shadow-md border border-border flex items-center justify-center animate-bounce [animation-duration:3s]">
                 <HugeiconsIcon icon={ShoppingBag01Icon} className="size-5 text-green-600" />
              </div>
              <div className="absolute bottom-1/4 right-0 size-10 rounded-full bg-white dark:bg-muted shadow-md border border-border flex items-center justify-center animate-pulse">
                 <HugeiconsIcon icon={WorkflowSquare01Icon} className="size-5 text-purple-600" />
              </div>
              <div className="absolute bottom-10 left-4 size-10 rounded-full bg-white dark:bg-muted shadow-md border border-border flex items-center justify-center">
                 <HugeiconsIcon icon={Globe02Icon} className="size-5 text-blue-600" />
              </div>
              <div className="absolute top-1/4 right-4 size-10 rounded-full bg-white dark:bg-muted shadow-md border border-border flex items-center justify-center animate-bounce">
                 <HugeiconsIcon icon={CodeIcon} className="size-5 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Right Card: Payment Methods */}
          <div className="rounded-[40px] bg-background dark:bg-muted/10 p-10 md:p-12 border border-border/50 group overflow-hidden">
            <div className="max-w-xs mb-8">
              <h3 className="text-2xl font-bold mb-4">Works with all payment methods</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Accept M-Pesa, Airtel Money, and bank transfers. All through one payment page.
              </p>
            </div>

            {/* Real Payment Methods Image */}
            <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-lg group-hover:shadow-xl transition-shadow duration-500">
              <img
                src="/payment-methods.png"
                alt="Salamapay supported payment methods"
                className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700"
              />
            </div>

            {/* Payment Methods Pills */}
            <div className="flex flex-wrap gap-2 mt-6">
              {[
                "M-Pesa", "Tigo Pesa", "Airtel Money", "Halo Pesa",
                "VISA", "Mastercard", "Google Pay", "Apple Pay",
              ].map((name, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full bg-muted/40 border border-border/40 text-xs font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all duration-300"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
