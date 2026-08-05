"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Globe02Icon, 
  CodeIcon, 
  WorkflowSquare01Icon,
  ShoppingBag01Icon
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

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
          <div className="rounded-[40px] bg-background dark:bg-muted/10 p-10 md:p-12 border border-border/50 group">
            <div className="max-w-xs mb-12">
              <h3 className="text-2xl font-bold mb-4">Works with all payment methods</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Accept M-Pesa, Airtel Money, and bank transfers. All through one payment page.
              </p>
            </div>

            {/* Payment Methods Grid */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {[
                { name: "m-pesa", color: "text-red-600" },
                { name: "Tigo Pesa", color: "text-blue-600" },
                { name: "airtel Money", color: "text-red-500" },
                { name: "halo pesa", color: "text-orange-500" },
                { name: "VISA", color: "text-blue-800", font: "italic font-black" },
                { name: "mastercard", color: "text-orange-600", font: "font-bold" },
                { name: "G Pay", color: "text-foreground", font: "font-medium" },
                { name: "Apple Pay", color: "text-foreground", font: "font-medium" },
                { name: "PayPal", color: "text-blue-700", font: "italic font-bold" },
              ].map((item, i) => (
                <div key={i} className="aspect-[4/3] rounded-2xl bg-muted/30 border border-border/30 flex items-center justify-center p-4 hover:bg-background hover:shadow-lg transition-all duration-300">
                   <span className={cn("text-[10px] md:text-xs text-center leading-none", item.color, item.font)}>
                     {item.name}
                   </span>
                </div>
              ))}
              <div className="col-span-3 aspect-[8/1] rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-center p-2 mt-2">
                 <span className="text-[8px] font-bold text-primary uppercase tracking-[0.2em]">And many more...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
