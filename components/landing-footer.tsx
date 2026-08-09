"use client"

import Link from "next/link"
import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  TwitterIcon,
  InstagramIcon,
  Linkedin01Icon,
  Facebook01Icon,
  AppleIcon,
  PlayStoreIcon,
  SentIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons"

const footerColumns = [
  {
    title: "Products",
    links: ["Salamapay Me", "Salamapay Store", "Salamapay Pay", "Mobile App"],
  },
  {
    title: "Developers",
    links: ["Documentation", "API Reference", "Webhooks", "Status"],
    paths: ["/docs", "/docs/api-reference", "/docs/webhooks", "#"],
  },
  {
    title: "Resources",
    links: ["Pricing", "Blog", "Help Center", "Get Verified"],
    paths: ["/pricing", "#", "#", "#"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Affiliates", "Contact"],
  },
]

const socials = [
  { icon: TwitterIcon, label: "Twitter" },
  { icon: InstagramIcon, label: "Instagram" },
  { icon: Linkedin01Icon, label: "LinkedIn" },
  { icon: Facebook01Icon, label: "Facebook" },
]

function DownloadPill({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) {
  return (
    <button className="flex items-center gap-3 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-colors w-full sm:w-auto text-left backdrop-blur-sm">
      <HugeiconsIcon icon={Icon} className="size-5 shrink-0 text-white/90" />
      <div className="flex flex-col leading-tight">
        <span className="text-[9px] uppercase font-medium text-white/50 tracking-wide">{subtitle}</span>
        <span className="text-sm font-bold">{title}</span>
      </div>
    </button>
  )
}

export function LandingFooter() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setEmail("")
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <footer className="relative overflow-hidden bg-zinc-950 text-white">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />

      <div className="relative container mx-auto px-4 pt-20 pb-10">
        {/* Top: Brand + Newsletter */}
        <div className="grid gap-12 lg:grid-cols-2 pb-16 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <img src="/salamapaylogo.png" alt="Salamapay" className="size-9 object-contain" />
              <span className="text-2xl font-bold tracking-tight">Salamapay</span>
            </div>
            <p className="text-sm text-white/60 max-w-sm leading-relaxed mb-8">
              The payment infrastructure for African creators, merchants, and builders.
              Mobile money, cards, and bank transfers — one simple API. Built in Dar es Salaam, Tanzania.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <DownloadPill icon={AppleIcon} title="App Store" subtitle="Download on the" />
              <DownloadPill icon={PlayStoreIcon} title="Google Play" subtitle="Get it on" />
            </div>
          </div>

          <div className="lg:pl-8 lg:border-l lg:border-white/10 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <HugeiconsIcon icon={Mail01Icon} className="size-4 text-primary" />
              <h4 className="font-bold text-sm uppercase tracking-wider text-white/80">Stay in the loop</h4>
            </div>
            <p className="text-sm text-white/50 mb-5 max-w-md leading-relaxed">
              Product updates, new payment channels, and developer changelogs — straight to your inbox. No spam.
            </p>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md items-center gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 h-11 rounded-lg bg-white/5 border border-white/10 px-4 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary/60 focus:bg-white/10 transition-all"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-1.5 h-11 px-4 rounded-lg bg-primary text-white text-sm font-semibold shrink-0 hover:opacity-90 transition-opacity"
              >
                {submitted ? "Subscribed" : "Subscribe"}
                {!submitted && <HugeiconsIcon icon={SentIcon} className="size-3.5" />}
              </button>
            </form>
          </div>
        </div>

        {/* Middle: Link columns */}
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 py-14">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-xs mb-5 uppercase tracking-widest text-white/40">{col.title}</h4>
              <ul className="space-y-3.5 text-sm">
                {col.links.map((link, j) => (
                  <li key={link}>
                    <Link href={(col.paths && col.paths[j]) || "#"} className="text-white/70 hover:text-white transition-colors inline-flex items-center gap-1 group">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Giant wordmark */}
        <div className="relative select-none py-4 overflow-hidden">
          <h2 className="text-center font-black tracking-tighter leading-none text-white/[0.06] text-[18vw] sm:text-[14vw] lg:text-[10rem] whitespace-nowrap">
            SALAMAPAY
          </h2>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-xs text-white/40 text-center md:text-left">
            <p>© {new Date().getFullYear()} Salamapay Payments. All rights reserved.</p>
            <div className="hidden md:flex gap-4 items-center">
              <div className="size-1 rounded-full bg-white/20" />
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <div className="size-1 rounded-full bg-white/20" />
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {socials.map((s) => (
              <Link
                key={s.label}
                href="#"
                aria-label={s.label}
                className="flex size-9 items-center justify-center rounded-full border border-white/10 text-white/60 hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-all"
              >
                <HugeiconsIcon icon={s.icon} className="size-4" />
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile-only policy links */}
        <div className="md:hidden mt-4 flex justify-center gap-6 text-[10px] text-white/30">
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}
