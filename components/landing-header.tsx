"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <div className="flex items-center gap-2">
          <img src="/salamapaylogo.png" alt="Salamapay" className="size-8 object-contain" />
          <span className="text-xl font-bold tracking-tight hidden sm:inline-block">Salamapay</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="#features" className="transition-colors hover:text-primary">Features</Link>
          <Link href="#solutions" className="transition-colors hover:text-primary">Solutions</Link>
          <Link href="#pricing" className="transition-colors hover:text-primary">Pricing</Link>
          <Link href="#about" className="transition-colors hover:text-primary">About</Link>
        </nav>

        <div className="flex items-center gap-4">
          <ModeToggle />
          <Link href="/auth/login">
            <Button variant="ghost" size="sm" className="hidden sm:flex">Login</Button>
          </Link>
          <Link href="/auth/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
