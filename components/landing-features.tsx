"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Link01Icon, 
  Store01Icon, 
  ShoppingCart01Icon,
  Tick02Icon,
  CreditCardIcon,
  SmartPhone01Icon
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export function LandingFeatures() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="max-w-3xl mb-16">
          <h4 className="text-primary text-xs font-bold uppercase tracking-widest mb-4">Salamapay Tools</h4>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            Salamapay handles your payments with payment links, storefronts, and seamless checkouts. 
            <span className="inline-flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary mx-2 align-middle">
              <HugeiconsIcon icon={ShoppingCart01Icon} className="size-5" />
            </span>
            Sell products, services, subscriptions with ease.
          </h2>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Large Card: Instant Payment Pages */}
          <div className="lg:col-span-7 rounded-3xl bg-[#F8FAF8] dark:bg-muted/20 border border-border/50 p-8 md:p-12 flex flex-col overflow-hidden group">
            <div className="max-w-md mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-background border text-[10px] font-bold text-primary mb-6">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                Payment Link
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight text-foreground">Instant payment pages</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Create a payment page in seconds. Share your unique salamapay.me link and start receiving payments from anyone, anywhere.
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-medium text-muted-foreground/60">
                <span className="flex items-center gap-1.5">1. Visit link <HugeiconsIcon icon={Link01Icon} className="size-3" /></span>
                <span className="text-primary/20">→</span>
                <span className="flex items-center gap-1.5">2. Browse products</span>
                <span className="text-primary/20">→</span>
                <span className="flex items-center gap-1.5">3. Make payment</span>
              </div>
            </div>
            
            {/* Visual Mockup for Card 1 */}
            <div className="mt-auto relative flex justify-center pt-8">
              <div className="w-[300px] md:w-[350px] bg-white dark:bg-background rounded-3xl shadow-2xl border border-border/50 overflow-hidden transform group-hover:-translate-y-2 transition-transform duration-500">
                <div className="p-6 text-center border-b bg-primary/5">
                  <div className="size-20 rounded-full mx-auto mb-4 bg-muted overflow-hidden border-4 border-white dark:border-muted relative">
                     <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                        <HugeiconsIcon icon={ShoppingCart01Icon} className="size-8 text-primary/40" />
                     </div>
                  </div>
                  <h4 className="font-bold">Amina Juma</h4>
                  <p className="text-xs text-muted-foreground">Tsh 50,000</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Pay with</p>
                    <div className="p-3 rounded-xl border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-muted flex items-center justify-center text-primary">
                          <HugeiconsIcon icon={SmartPhone01Icon} className="size-4" />
                        </div>
                        <span className="text-sm font-medium">Mobile Money</span>
                      </div>
                      <div className="size-4 rounded-full border border-primary flex items-center justify-center">
                        <div className="size-2 rounded-full bg-primary" />
                      </div>
                    </div>
                    <div className="p-3 rounded-xl border flex items-center justify-between opacity-50">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
                          <HugeiconsIcon icon={CreditCardIcon} className="size-4" />
                        </div>
                        <span className="text-sm font-medium">Card</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-10 w-full bg-black dark:bg-primary rounded-xl flex items-center justify-center text-white text-sm font-bold">
                    Pay Tsh 50,000
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Stacked Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Top Right: Storefront */}
            <div className="flex-1 rounded-3xl bg-[#EEF2FF] dark:bg-muted/10 border border-border/50 p-8 flex flex-col overflow-hidden group">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-background border text-[10px] font-bold text-blue-600 mb-4 uppercase">
                  <span className="size-1.5 rounded-full bg-blue-600" />
                  Salamapay Store
                </div>
                <h3 className="text-xl font-bold mb-2 tracking-tight">A full storefront for your business</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Built for merchants moving real volume physical goods, digital products, and subscriptions.
                </p>
              </div>
              
              {/* Visual Mockup for Card 2 */}
              <div className="grid grid-cols-2 gap-3 mt-auto">
                {[
                  { title: "Course", price: "TZS 50,000", icon: Store01Icon },
                  { title: "Event tickets", price: "TZS 50,000", icon: Tick02Icon },
                  { title: "Subscription", price: "TZS 50,000", icon: ShoppingCart01Icon },
                  { title: "Services", price: "TZS 50,000", icon: SmartPhone01Icon },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-white dark:bg-background border border-border/50 shadow-sm group-hover:scale-[1.02] transition-transform duration-300">
                    <div className="size-8 rounded-lg bg-muted flex items-center justify-center mb-2">
                       <HugeiconsIcon icon={item.icon} className="size-4 text-blue-600" />
                    </div>
                    <p className="text-[10px] font-bold truncate">{item.title}</p>
                    <p className="text-[8px] text-muted-foreground">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Right: API/Integration */}
            <div className="flex-1 rounded-3xl bg-[#FFF7ED] dark:bg-muted/10 border border-border/50 p-8 flex flex-col overflow-hidden group">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-background border text-[10px] font-bold text-orange-600 mb-4 uppercase">
                  <span className="size-1.5 rounded-full bg-orange-600" />
                  Salamapay Pay
                </div>
                <h3 className="text-xl font-bold mb-2 tracking-tight">Payment integration</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Sell courses, ebooks, physical products, and services. Manage inventory, customers, and orders from one dashboard.
                </p>
              </div>

              {/* Visual Mockup for Card 3 */}
              <div className="bg-white dark:bg-background rounded-2xl p-4 border border-border/50 shadow-sm mt-auto group-hover:translate-x-2 transition-transform duration-300">
                 <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1.5">
                       {['A','P','I'].map(char => (
                         <div key={char} className="size-8 rounded bg-orange-600 flex items-center justify-center text-white text-[10px] font-bold">{char}</div>
                       ))}
                    </div>
                    <div className="flex gap-2 opacity-50">
                       <div className="h-2 w-12 bg-muted rounded-full" />
                       <div className="h-2 w-8 bg-muted rounded-full" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="h-8 w-full bg-muted/50 rounded-lg flex items-center px-3 justify-between">
                       <span className="text-[8px] font-bold">PAYMENT</span>
                       <div className="flex gap-1">
                          {[1,2,3,4].map(i => <div key={i} className="size-3 rounded-sm bg-muted" />)}
                       </div>
                    </div>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
