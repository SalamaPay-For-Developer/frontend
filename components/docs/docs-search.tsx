"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ALL_DOC_PAGES, DOC_NAV } from "@/lib/docs-config"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface DocsSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DocsSearch({ open, onOpenChange }: DocsSearchProps) {
  const [query, setQuery] = useState("")

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return ALL_DOC_PAGES.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
    ).slice(0, 10)
  }, [query])

  useEffect(() => {
    if (!open) setQuery("")
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        onOpenChange(true)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Search Documentation</DialogTitle>
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <HugeiconsIcon icon={Search01Icon} className="size-4 text-muted-foreground" />
          <input
            autoFocus
            placeholder="Search documentation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="select-none rounded border bg-muted px-1.5 font-mono text-xs text-muted-foreground">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              {query ? "No results found." : "Start typing to search..."}
            </div>
          ) : (
            <ul className="flex flex-col">
              {results.map((page) => {
                const section = DOC_NAV.find((s) => s.items.some((i) => i.slug === page.slug))
                return (
                  <li key={page.slug}>
                    <Link
                      href={`/docs/${page.slug}`}
                      onClick={() => onOpenChange(false)}
                      className={cn(
                        "flex flex-col gap-0.5 px-4 py-2.5 hover:bg-accent transition-colors border-b last:border-0"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{page.title}</span>
                        {section && (
                          <span className="text-xs text-muted-foreground">— {section.section}</span>
                        )}
                      </div>
                      {page.description && (
                        <span className="text-xs text-muted-foreground">{page.description}</span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
