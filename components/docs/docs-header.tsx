"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, Menu01Icon, Moon01Icon, Sun03Icon } from "@hugeicons/core-free-icons"
import { useTheme } from "next-themes"
import { DOC_NAV } from "@/lib/docs-config"
import { usePathname } from "next/navigation"

export function DocsHeader({ onSearchClick }: { onSearchClick?: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { title: "Documentation", href: "/docs" },
    { title: "API Reference", href: "/docs/api-payments" },
    { title: "Guides", href: "/docs/quickstart" },
    { title: "Changelog", href: "/docs/changelog" },
    { title: "Status", href: "/docs/api-status" },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow",
        scrolled && "shadow-sm"
      )}
    >
      <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="lg:hidden">
                <HugeiconsIcon icon={Menu01Icon} className="size-5" />
              </Button>
            }
          />
          <SheetContent side="left" className="w-72 overflow-y-auto">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex flex-col gap-4 pt-4">
              <Link href="/docs" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="text-xs font-bold">SP</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">SalamaPay</p>
                  <p className="text-xs text-muted-foreground">Developers</p>
                </div>
              </Link>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
                  >
                    {link.title}
                  </Link>
                ))}
              </nav>
              <div className="border-t pt-4">
                {DOC_NAV.map((section) => (
                  <div key={section.section} className="mb-4">
                    <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      {section.section}
                    </p>
                    {section.items.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/docs/${item.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "block rounded-lg px-3 py-1.5 text-sm hover:bg-accent transition-colors",
                          pathname === `/docs/${item.slug}` && "bg-accent font-medium"
                        )}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/docs" className="flex items-center gap-2 shrink-0">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-xs font-bold">SP</span>
          </div>
          <div className="hidden sm:block">
            <p className="font-semibold text-sm leading-tight">SalamaPay</p>
            <p className="text-xs text-muted-foreground leading-tight">Developers</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent",
                pathname === link.href && "bg-accent"
              )}
            >
              {link.title}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Search */}
          <button
            onClick={onSearchClick}
            className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent transition-colors w-40 md:w-56"
          >
            <HugeiconsIcon icon={Search01Icon} className="size-4" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="ml-auto hidden md:inline-flex select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs">
              ⌘K
            </kbd>
          </button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="size-9"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <HugeiconsIcon icon={Sun03Icon} className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <HugeiconsIcon icon={Moon01Icon} className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" render={<Link href="/auth/login" />}>
              Sign In
            </Button>
            <Button size="sm" render={<Link href="/auth/register" />}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
