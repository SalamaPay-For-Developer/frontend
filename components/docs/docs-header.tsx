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
import { Search01Icon, Menu01Icon, Moon01Icon, Sun03Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
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
        <Link href="/docs" className="flex items-center gap-2 shrink-0 mr-4">
          <img src="/salamapaylogo.png" alt="Salamapay" className="size-7 object-contain" />
          <span className="font-bold text-sm tracking-tight hidden sm:inline-block">Salamapay</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-xs font-semibold transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.title}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          {/* Search */}
          <button
            onClick={onSearchClick}
            className="flex items-center gap-3 rounded-md border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent transition-all w-48 md:w-64 group"
          >
            <HugeiconsIcon icon={Search01Icon} className="size-3.5 group-hover:text-primary transition-colors" />
            <span className="flex-1 text-left">Search</span>
            <div className="flex items-center gap-1 opacity-60 font-mono text-[10px]">
              <kbd className="rounded border bg-background px-1.5 py-0.5">Ctrl</kbd>
              <kbd className="rounded border bg-background px-1.5 py-0.5">K</kbd>
            </div>
          </button>

          {/* Theme toggle */}
          <div className="flex items-center gap-1 border-l pl-4 border-border/50">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-md"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <HugeiconsIcon icon={Sun03Icon} className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <HugeiconsIcon icon={Moon01Icon} className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
