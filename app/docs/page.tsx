"use client"

import { useState } from "react"
import { DocsLayout } from "@/components/docs/docs-layout"
import { DocsSearch } from "@/components/docs/docs-search"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon, SentIcon, CreditCardIcon, WebhookIcon,
  ArrowDown01Icon, BankIcon, ArrowRight01Icon, CodeIcon,
  CheckmarkCircle01Icon, Cancel01Icon, Key01Icon,
} from "@hugeicons/core-free-icons"

export default function DocsHomePage() {
  const [searchOpen, setSearchOpen] = useState(false)

  const quickLinks = [
    { title: "Payments", desc: "Accept mobile money, cards, and bank payments", href: "/docs/payments-overview", icon: SentIcon },
    { title: "Checkout", desc: "Hosted checkout sessions for your customers", href: "/docs/checkout-overview", icon: CreditCardIcon },
    { title: "Webhooks", desc: "Receive real-time payment notifications", href: "/docs/webhooks-overview", icon: WebhookIcon },
    { title: "Utility Payments", desc: "Pay electricity, water, TV, and internet bills", href: "/docs/utility-overview", icon: ArrowDown01Icon },
    { title: "Government Payments", desc: "Pay government bills via control numbers", href: "/docs/government-overview", icon: BankIcon },
    { title: "Authentication", desc: "Secure your API with keys and signing", href: "/docs/auth-overview", icon: Key01Icon },
  ]

  const popularGuides = [
    "Build your first payment",
    "Create a checkout session",
    "Handle webhooks",
    "Verify a transaction",
    "Go live checklist",
  ]

  return (
    <>
      <DocsLayout>
        {/* Hero */}
        <div className="flex flex-col items-center text-center py-12 gap-6">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              SalamaPay Developers
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Build payments into your application. Simple APIs for collecting payments,
              creating checkout sessions, managing transactions, and receiving real-time
              payment notifications.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" render={<Link href="/docs/quickstart" />}>
              Get Started
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/docs/api-payments" />}>
              <HugeiconsIcon icon={CodeIcon} className="size-4" />
              API Reference
            </Button>
          </div>

          {/* Search bar */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent transition-colors w-full max-w-md mt-2"
          >
            <HugeiconsIcon icon={Search01Icon} className="size-4" />
            Search documentation...
            <kbd className="ml-auto select-none rounded border bg-muted px-1.5 font-mono text-xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* What are you building? */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">What are you building?</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map((link) => (
              <Link key={link.title} href={link.href}>
                <Card className="border-none shadow-sm dark:bg-muted/50 hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-5 flex flex-col gap-2">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <HugeiconsIcon icon={link.icon} className="size-5 text-primary" />
                    </div>
                    <h3 className="font-semibold">{link.title}</h3>
                    <p className="text-sm text-muted-foreground">{link.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Guides */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Popular Guides</h2>
          <div className="flex flex-col gap-2">
            {popularGuides.map((guide, i) => (
              <Link
                key={guide}
                href={i === 0 ? "/docs/quickstart" : i === 1 ? "/docs/create-checkout" : i === 2 ? "/docs/webhooks-overview" : i === 3 ? "/docs/retrieve-transaction" : "/docs/production-checklist"}
                className="flex items-center justify-between rounded-lg border px-4 py-3 hover:bg-accent transition-colors"
              >
                <span className="text-sm font-medium">{guide}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>

        {/* Feature highlights */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-2 rounded-lg border p-5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950/30">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4 text-green-500" />
            </div>
            <h3 className="font-semibold text-sm">Secure by Design</h3>
            <p className="text-xs text-muted-foreground">API keys, request signing, webhook verification, and idempotency built in.</p>
          </div>
          <div className="flex flex-col gap-2 rounded-lg border p-5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <HugeiconsIcon icon={CodeIcon} className="size-4 text-blue-500" />
            </div>
            <h3 className="font-semibold text-sm">Developer First</h3>
            <p className="text-xs text-muted-foreground">Clean REST APIs, multi-language examples, and comprehensive documentation.</p>
          </div>
          <div className="flex flex-col gap-2 rounded-lg border p-5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/30">
              <HugeiconsIcon icon={SentIcon} className="size-4 text-purple-500" />
            </div>
            <h3 className="font-semibold text-sm">Tanzania-Ready</h3>
            <p className="text-xs text-muted-foreground">Mobile money, utility bills, government payments, and local payment methods.</p>
          </div>
        </div>
      </DocsLayout>

      <DocsSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
