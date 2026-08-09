"use client"

import { LandingHeader } from "@/components/landing-header"
import { LandingFooter } from "@/components/landing-footer"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle01Icon,
  ArrowRight01Icon,
  Calculator01Icon,
  PercentIcon,
} from "@hugeicons/core-free-icons"
import Link from "next/link"

const collectionChannels = [
  { name: "M-Pesa", fee: "1.2%", type: "Mobile Money" },
  { name: "Tigo Pesa", fee: "1.2%", type: "Mobile Money" },
  { name: "Airtel Money", fee: "1.2%", type: "Mobile Money" },
  { name: "Halo Pesa", fee: "1.2%", type: "Mobile Money" },
  { name: "VISA / Mastercard", fee: "1.2%", type: "Card" },
  { name: "Bank Transfer", fee: "1.2%", type: "Bank" },
]

const payoutChannels = [
  { name: "Mobile Money Payout", fee: "2%", note: "Min 500 TZS" },
  { name: "Bank Transfer Payout", fee: "2%", note: "Min 500 TZS" },
]

const includedFeatures = [
  "No monthly fees",
  "No setup costs",
  "No hidden charges",
  "Unlimited transactions",
  "Free payment links",
  "Free webhooks",
  "Free API access",
  "Daily settlements",
  "Real-time dashboard",
  "Email & SMS receipts",
  "Multi-business support",
  "Developer sandbox",
]

const faqItems = [
  {
    q: "Are there any monthly or setup fees?",
    a: "No. Salamapay is completely free to join. You only pay the 1.2% transaction fee when you receive a payment.",
  },
  {
    q: "How is the 1.2% calculated?",
    a: "The fee is calculated on the transaction amount. For example, if a customer pays 50,000 TZS, the fee is 600 TZS and you receive 49,400 TZS.",
  },
  {
    q: "What about payouts and withdrawals?",
    a: "Payouts to mobile money or bank accounts cost 2% with a minimum fee of 500 TZS. Withdrawals from your Salamapay balance to your registered bank account are free.",
  },
  {
    q: "Do you offer volume discounts?",
    a: "Yes! Businesses processing over 50M TZS per month qualify for custom rates. Contact our sales team to discuss.",
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 mb-6">
              <HugeiconsIcon icon={PercentIcon} className="size-4 text-primary" />
              <span className="text-sm font-medium text-primary">Simple, transparent pricing</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              One flat rate.{" "}
              <span className="text-primary">No surprises.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Pay only when you get paid. No monthly fees, no setup costs, no hidden charges.
              Just a simple 1.2% per transaction.
            </p>
          </div>
        </section>

        {/* Main Pricing Card */}
        <section className="pb-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              {/* Collection Card */}
              <div className="relative rounded-3xl border-2 border-primary/20 bg-primary/5 p-8 md:p-10 flex flex-col">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground">
                  PAYMENTS IN
                </div>
                <div className="text-center mb-8 mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Per transaction</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-6xl font-black tracking-tighter">1.2</span>
                    <span className="text-3xl font-bold">%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">No monthly fees · No setup</p>
                </div>
                <div className="space-y-3 mb-8 flex-1">
                  {collectionChannels.map((ch) => (
                    <div key={ch.name} className="flex items-center justify-between rounded-xl bg-background/60 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                          <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{ch.name}</p>
                          <p className="text-xs text-muted-foreground">{ch.type}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-primary">{ch.fee}</span>
                    </div>
                  ))}
                </div>
                <Link href="/auth/register" className="block">
                  <div className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                    Start accepting payments
                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                  </div>
                </Link>
              </div>

              {/* Payout Card */}
              <div className="relative rounded-3xl border border-border bg-muted/20 p-8 md:p-10 flex flex-col">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-zinc-800 px-4 py-1 text-xs font-bold text-white">
                  PAYOUTS OUT
                </div>
                <div className="text-center mb-8 mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Per payout</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-6xl font-black tracking-tighter">2</span>
                    <span className="text-3xl font-bold">%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">Min 500 TZS per payout</p>
                </div>
                <div className="space-y-3 mb-8 flex-1">
                  {payoutChannels.map((ch) => (
                    <div key={ch.name} className="flex items-center justify-between rounded-xl bg-background/60 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-zinc-800/10">
                          <HugeiconsIcon icon={ArrowRight01Icon} className="size-4 text-zinc-700 dark:text-zinc-300" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{ch.name}</p>
                          <p className="text-xs text-muted-foreground">{ch.note}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold">{ch.fee}</span>
                    </div>
                  ))}
                  <div className="rounded-xl bg-background/60 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-green-500/10">
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Withdrawals to bank</p>
                        <p className="text-xs text-muted-foreground">From Salamapay balance</p>
                      </div>
                    </div>
                    <div className="mt-2 ml-11">
                      <span className="text-sm font-bold text-green-500">FREE</span>
                    </div>
                  </div>
                </div>
                <Link href="/auth/register" className="block">
                  <div className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-border bg-background font-semibold text-sm hover:bg-muted/50 transition-colors">
                    Create a free account
                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Everything included. No extras.
              </h2>
              <p className="text-muted-foreground">
                Every feature you need to run your payments, included from day one.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {includedFeatures.map((feat) => (
                <div key={feat} className="flex items-center gap-3 rounded-xl bg-background border border-border/50 px-4 py-3">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-5 text-primary shrink-0" />
                  <span className="text-sm font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fee Calculator */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 mb-6">
              <HugeiconsIcon icon={Calculator01Icon} className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Fee Calculator</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              See exactly what you&apos;ll pay
            </h2>
            <p className="text-muted-foreground mb-10">
              Enter an amount to see the fee and what you receive.
            </p>
            <div className="rounded-2xl border border-border bg-muted/20 p-8">
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Transaction amount (TZS)</label>
                  <input
                    type="number"
                    placeholder="10,000"
                    className="w-full h-12 rounded-xl bg-background border border-border px-4 text-lg font-semibold outline-none focus:border-primary/60 transition-colors"
                    id="calc-amount"
                    onInput={(e) => {
                      const input = e.currentTarget
                      const amount = parseFloat(input.value) || 0
                      const fee = amount * 0.012
                      const net = amount - fee
                      const feeEl = document.getElementById("calc-fee")
                      const netEl = document.getElementById("calc-net")
                      if (feeEl) feeEl.textContent = `${Math.round(fee).toLocaleString()} TZS`
                      if (netEl) netEl.textContent = `${Math.round(net).toLocaleString()} TZS`
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-destructive/5 border border-destructive/10 p-4">
                    <p className="text-xs text-muted-foreground mb-1">Salamapay fee (1.2%)</p>
                    <p id="calc-fee" className="text-xl font-bold text-destructive">0 TZS</p>
                  </div>
                  <div className="rounded-xl bg-green-500/5 border border-green-500/10 p-4">
                    <p className="text-xs text-muted-foreground mb-1">You receive</p>
                    <p id="calc-net" className="text-xl font-bold text-green-600 dark:text-green-400">0 TZS</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing FAQ */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Pricing FAQ</h2>
            <div className="space-y-4">
              {faqItems.map((item) => (
                <div key={item.q} className="rounded-2xl bg-background border border-border/50 px-6 py-5">
                  <p className="font-bold text-sm mb-2">{item.q}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  )
}
