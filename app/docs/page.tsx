"use client"

import { useState, useEffect } from "react"
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
  Copy01Icon,
} from "@hugeicons/core-free-icons"

export default function DocsHomePage() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [headings, setHeadings] = useState<{ id: string; title: string; level: number }[]>([])

  useEffect(() => {
    const items = [
      { id: "what-is-salamapay", title: "What is SalamaPay?", level: 2 },
      { id: "base-url", title: "Base URL", level: 2 },
      { id: "authentication", title: "Authentication", level: 2 },
      { id: "quick-start", title: "Quick Start", level: 2 },
    ]
    setHeadings(items)
  }, [])

  const quickLinks = [
    { title: "Payments", desc: "Accept mobile money, cards, and bank payments", href: "/docs/payments-overview", icon: SentIcon },
    { title: "Checkout", desc: "Hosted checkout sessions for your customers", href: "/docs/checkout-overview", icon: CreditCardIcon },
    { title: "Webhooks", desc: "Receive real-time payment notifications", href: "/docs/webhooks-overview", icon: WebhookIcon },
  ]

  return (
    <>
      <DocsLayout headings={headings}>
        <article className="flex flex-col gap-6">
          <header className="flex flex-col gap-4 border-b pb-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">SalamaPay Documentation</h1>
              <p className="text-base text-muted-foreground leading-relaxed">
                What SalamaPay is, who it is for, and how to get started with the payments API.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-2 text-xs font-semibold rounded-md">
                <HugeiconsIcon icon={Copy01Icon} className="size-3.5" />
                Copy Markdown
              </Button>
              <div className="flex items-center">
                <Button variant="outline" size="sm" className="h-8 gap-2 text-xs font-semibold rounded-l-md border-r-0">
                  Open
                </Button>
                <Button variant="outline" size="sm" className="h-8 px-2 rounded-r-md">
                  <HugeiconsIcon icon={ArrowDown01Icon} className="size-3" />
                </Button>
              </div>
            </div>
          </header>

          <div className="docs-content flex flex-col gap-10 py-4 prose dark:prose-invert max-w-none prose-sm prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-pre:p-0 prose-pre:bg-transparent">
            <section id="what-is-salamapay">
              <p className="text-base leading-relaxed">
                SalamaPay is a payment processing API that enables you to <span className="font-semibold text-foreground">accept payments via mobile money</span>, and send disbursements to mobile money and bank accounts.
              </p>
            </section>

            <section id="base-url">
              <h2 className="text-2xl font-bold tracking-tight mb-4">Base URL</h2>
              <div className="relative group">
                <pre className="rounded-lg border bg-zinc-50 dark:bg-zinc-900 p-4 font-mono text-sm overflow-x-auto transition-all group-hover:border-primary/30 shadow-sm">
                  <code>https://api.lipasalama.co.tz/api/v1</code>
                </pre>
                <button className="absolute right-4 top-4 p-1.5 rounded-md hover:bg-accent text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  <HugeiconsIcon icon={Copy01Icon} className="size-3.5" />
                </button>
              </div>
            </section>

            <section id="authentication">
              <h2 className="text-2xl font-bold tracking-tight mb-4">Authentication</h2>
              <p className="text-muted-foreground mb-4">
                All API requests require authentication using an API key in the <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">Authorization</code> header:
              </p>
              <div className="relative group">
                <pre className="rounded-lg border bg-zinc-50 dark:bg-zinc-900 p-4 font-mono text-sm overflow-x-auto transition-all group-hover:border-primary/30 shadow-sm">
                  <code className="text-green-600 dark:text-green-400">Authorization: Bearer your_api_key_here</code>
                </pre>
                <button className="absolute right-4 top-4 p-1.5 rounded-md hover:bg-accent text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  <HugeiconsIcon icon={Copy01Icon} className="size-3.5" />
                </button>
              </div>
            </section>

            <section id="quick-start">
              <h2 className="text-2xl font-bold tracking-tight mb-6">Quick Start</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {quickLinks.map((link) => (
                  <Link key={link.title} href={link.href}>
                    <Card className="border border-border/50 shadow-sm bg-zinc-50 dark:bg-zinc-900/50 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer h-full group rounded-lg">
                      <CardContent className="p-6 flex flex-col gap-3">
                        <h3 className="font-bold text-sm leading-tight text-muted-foreground">{link.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{link.desc}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </article>
      </DocsLayout>

      <DocsSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
