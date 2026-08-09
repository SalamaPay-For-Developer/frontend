"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import Link from "next/link"

const faqs = [
  {
    question: "How much does Salamapay charge per transaction?",
    answer: "We charge a flat 1.2% fee per transaction. No monthly fees, no setup costs, no hidden charges. You only pay when you get paid. For example, on a 10,000 TZS payment, the fee is just 120 TZS.",
  },
  {
    question: "How fast do I get my money?",
    answer: "Settlements are processed daily. You can receive funds instantly to your mobile wallet or within 24 hours to your bank account.",
  },
  {
    question: "What payment methods does Salamapay support?",
    answer: "We support M-Pesa, Tigo Pesa, Airtel Money, Halo Pesa, VISA, Mastercard, and bank transfers. New channels are added regularly.",
  },
  {
    question: "Can I create payment links without a website?",
    answer: "Yes! With Salamapay Payment Links, you can generate a shareable link for any amount. Send it via WhatsApp, SMS, or email — your customer pays without needing an account.",
  },
  {
    question: "How do developers integrate Salamapay?",
    answer: "Our REST API is simple and well-documented. Get your sandbox API keys from the developer dashboard, integrate with a few lines of code, and test in minutes. We also support webhooks for real-time notifications.",
  },
  {
    question: "Is there a limit on withdrawals or payouts?",
    answer: "No limits on withdrawals from your Salamapay balance. Payouts to mobile money or bank accounts are processed instantly with a small 2% fee (minimum 500 TZS).",
  },
  {
    question: "What do I need to start accepting payments?",
    answer: "Register with your phone number, verify your identity, and add your business details. Once KYC is approved, you can start accepting payments immediately — no bank visits required.",
  },
  {
    question: "Is my money safe with Salamapay?",
    answer: "Yes. All transactions are encrypted and processed through Selcom, a licensed payment provider regulated by the Bank of Tanzania. Your funds are held in segregated accounts.",
  },
]

export function LandingFAQ() {
  return (
    <section id="faq" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Frequently asked questions
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Everything you need to know about Salamapay. Can&apos;t find what you&apos;re looking for?{" "}
            <Link href="/auth/register" className="text-primary font-medium hover:underline">
              Get started for free
            </Link>
            .
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Left: Image - now smaller, aligned top */}
          <div className="lg:col-span-2 lg:sticky lg:top-24">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-primary/10 group">
              <img 
                src="/34979.jpg" 
                alt="Salamapay Merchant" 
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0">
                    <img src="/salamapaylogo.png" alt="Logo" className="size-6 object-contain" />
                  </div>
                  <div className="text-white">
                    <p className="font-bold text-sm">Salamapay</p>
                    <p className="text-xs text-white/80">Payments made simple</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: FAQ Accordion - wider column */}
          <div className="lg:col-span-3 space-y-3">
            <Accordion className="w-full space-y-3 border-none bg-transparent">
              {faqs.map((faq, i) => (
                <AccordionItem 
                  key={i} 
                  value={`item-${i}`} 
                  className="bg-background rounded-2xl border border-border/50 px-6 overflow-hidden"
                >
                  <AccordionTrigger className="hover:no-underline py-5 text-left text-sm md:text-base font-bold tracking-tight border-none">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 text-sm leading-relaxed border-none">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="pt-4">
              <Link href="/auth/register">
                <Button className="group w-full sm:w-auto">
                  Get Started With Salamapay
                  <HugeiconsIcon icon={ArrowRight01Icon} className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
