"use client"

import Link from "next/link"
import { useState } from "react"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { HugeiconsIcon } from "@hugeicons/react"
import { DashboardSquare02Icon, Menu02Icon, Cancel01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"

export function LandingHeader() {
  const { isAuthenticated, isLoading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        {/* Logo only - bigger */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/salamapaylogo.png" alt="Salamapay" className="size-10 object-contain" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="#features" className="transition-colors hover:text-primary">Features</Link>
          <Link href="#solutions" className="transition-colors hover:text-primary">Solutions</Link>
          <Link href="/docs" className="transition-colors hover:text-primary">Docs</Link>
          <Link href="/pricing" className="transition-colors hover:text-primary">Pricing</Link>
          <Link href="#faq" className="transition-colors hover:text-primary">FAQ</Link>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ModeToggle />

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <HugeiconsIcon icon={mobileMenuOpen ? Cancel01Icon : Menu02Icon} className="size-5" />
          </Button>

          {/* Desktop auth buttons */}
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <Link href="/dashboard" className="hidden md:block">
                  <div className="flex items-center bg-black dark:bg-zinc-900 text-white h-9 pl-4 pr-1 py-1 rounded-md shadow-sm hover:opacity-90 transition-opacity cursor-pointer group">
                    <span className="text-xs font-semibold mr-2">Dashboard</span>
                    <div className="flex items-center justify-center size-7 bg-primary rounded-[4px]">
                      <HugeiconsIcon icon={DashboardSquare02Icon} className="size-3.5 text-white" />
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm" className="h-9 px-4 text-xs font-semibold rounded-md">Login</Button>
                  </Link>
                  <Link href="/auth/register">
                    <div className="flex items-center bg-black dark:bg-zinc-900 text-white h-9 pl-4 pr-1 py-1 rounded-md shadow-sm hover:opacity-90 transition-opacity cursor-pointer group">
                      <span className="text-xs font-semibold mr-2">Get Started</span>
                      <div className="flex items-center justify-center size-7 bg-primary rounded-[4px]">
                        <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5 text-white" />
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4 text-sm font-medium">
            <Link href="#features" className="transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Features</Link>
            <Link href="#solutions" className="transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Solutions</Link>
            <Link href="/docs" className="transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Docs</Link>
            <Link href="/pricing" className="transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            <Link href="#faq" className="transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
            <div className="flex flex-col gap-2 pt-2 border-t">
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <div className="flex items-center justify-between bg-black dark:bg-zinc-900 text-white h-10 pl-5 pr-1 py-1 rounded-md shadow-sm hover:opacity-90 transition-opacity cursor-pointer group">
                        <span className="text-sm font-semibold">Dashboard</span>
                        <div className="flex items-center justify-center size-8 bg-primary rounded-[4px]">
                          <HugeiconsIcon icon={DashboardSquare02Icon} className="size-4 text-white" />
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <>
                      <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full h-10 text-sm font-semibold rounded-md">Login</Button>
                      </Link>
                      <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                        <div className="flex items-center justify-between bg-black dark:bg-zinc-900 text-white h-10 pl-5 pr-1 py-1 rounded-md shadow-sm hover:opacity-90 transition-opacity cursor-pointer group">
                          <span className="text-sm font-semibold">Get Started</span>
                          <div className="flex items-center justify-center size-8 bg-primary rounded-[4px]">
                            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4 text-white" />
                          </div>
                        </div>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
