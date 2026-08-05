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
    question: "How much does Salamapay cost?",
    answer: "2.5% per transaction, no monthly charges. You only pay when you get paid.",
  },
  {
    question: "How fast do I get my money?",
    answer: "Settlements are processed daily. Depending on your choice, you can receive funds instantly or within 24 hours.",
  },
  {
    question: "Can I sell physical products?",
    answer: "Yes! Salamapay Storefronts are designed for both digital and physical goods with built-in inventory management.",
  },
  {
    question: "How do developers get started?",
    answer: "Our API documentation is comprehensive and easy to follow. You can get your sandbox keys and start testing in minutes.",
  },
  {
    question: "What payment methods are supported?",
    answer: "We support M-Pesa, Tigo Pesa, Airtel Money, Halo Pesa, VISA, Mastercard, and bank transfers.",
  },
  {
    question: "Is there a limit on withdrawals?",
    answer: "No, there are no limits on how much you can withdraw from your Salamapay balance to your bank or mobile wallet.",
  },
  {
    question: "What do I need to start accepting payments?",
    answer: "Just your business details and a verified ID. You can start accepting payments immediately after registration.",
  },
]

export function LandingFAQ() {
  return (
    <section id="faq" className="py-24 bg-[#E0E2E0] dark:bg-muted/5">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Trusted by businesses across Tanzania
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              From small merchants to growing enterprises, Salamapay is helping businesses 
              accept payments, send payouts, and scale their operations.
            </p>
          </div>
          <Link href="/auth/register">
            <Button className="bg-black dark:bg-primary text-white hover:bg-black/90 group">
              Get Started With Salamapay
              <HugeiconsIcon icon={ArrowRight01Icon} className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Visual/Image */}
          <div className="relative aspect-square rounded-[40px] overflow-hidden bg-primary/20 group">
            <img 
              src="/34979.jpg" 
              alt="Salamapay Merchant" 
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Overlay Pattern */}
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
            <div className="absolute inset-0 opacity-20" 
              style={{ 
                backgroundImage: "linear-gradient(135deg, currentColor 25%, transparent 25%), linear-gradient(225deg, currentColor 25%, transparent 25%), linear-gradient(45deg, currentColor 25%, transparent 25%), linear-gradient(315deg, currentColor 25%, transparent 25%)",
                backgroundPosition: "10px 0, 10px 0, 0 0, 0 0",
                backgroundSize: "20px 20px",
                backgroundRepeat: "repeat"
              }} 
            />
            
            {/* Branding badge in corner */}
            <div className="absolute top-8 left-8 size-24 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center animate-float">
               <img src="/salamapaylogo.png" alt="Logo" className="size-10 object-contain" />
            </div>
          </div>

          {/* Right Column: Accordion FAQ */}
          <div className="space-y-4">
            <Accordion className="w-full space-y-4 border-none bg-transparent">
              {faqs.map((faq, i) => (
                <AccordionItem 
                  key={i} 
                  value={`item-${i}`} 
                  className="bg-background dark:bg-muted/10 rounded-2xl border border-border/50 px-6 overflow-hidden"
                >
                  <AccordionTrigger className="hover:no-underline py-6 text-left text-sm md:text-base font-bold tracking-tight border-none">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6 border-none">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
