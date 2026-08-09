"use client"

import Link from "next/link"
import { ReactNode, useState, useEffect } from "react"
import { getAdjacentPages } from "@/lib/docs-config"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  ArrowLeft01Icon, 
  ArrowRight01Icon, 
  Copy01Icon, 
  ArrowDown01Icon 
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { DocsLayout } from "./docs-layout"

interface DocPageWrapperProps {
  slug: string
  title: string
  description?: string
  children: ReactNode
}

export function DocPageWrapper({ slug, title, description, children }: DocPageWrapperProps) {
  const { prev, next } = getAdjacentPages(slug)
  const [headings, setHeadings] = useState<{ id: string; title: string; level: number }[]>([])

  useEffect(() => {
    const content = document.querySelector(".docs-content")
    if (content) {
      const elements = Array.from(content.querySelectorAll("h2, h3"))
      const items = elements.map((el) => ({
        id: el.id || el.textContent?.toLowerCase().replace(/\s+/g, "-") || "",
        title: el.textContent || "",
        level: parseInt(el.tagName.substring(1)),
      }))
      // Ensure all elements have IDs
      elements.forEach((el, i) => {
        if (!el.id) el.id = items[i].id
      })
      setHeadings(items)
    }
  }, [children])

  return (
    <DocsLayout headings={headings}>
      <article className="flex flex-col gap-6">
        <header className="flex flex-col gap-4 border-b pb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">{title}</h1>
            {description && <p className="text-base text-muted-foreground leading-relaxed">{description}</p>}
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

        <div className="docs-content flex flex-col gap-8 py-4 prose dark:prose-invert max-w-none prose-sm prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-pre:p-0 prose-pre:bg-transparent">
          {children}
        </div>
      </article>

      {/* Prev / Next navigation */}
      <nav className="mt-16 flex items-center justify-between gap-4 border-t pt-8">
        {prev ? (
          <Link
            href={`/docs/${prev.slug}`}
            className="flex-1 group flex flex-col gap-2 rounded-lg border border-border/50 p-4 hover:bg-accent/50 hover:border-primary/30 transition-all"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-1">
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3 group-hover:-translate-x-1 transition-transform" />
              Previous
            </span>
            <span className="text-sm font-semibold group-hover:text-primary transition-colors">{prev.title}</span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        
        <div className="w-4" />

        {next ? (
          <Link
            href={`/docs/${next.slug}`}
            className="flex-1 group flex flex-col gap-2 rounded-lg border border-border/50 p-4 hover:bg-accent/50 hover:border-primary/30 transition-all text-right"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-1 justify-end">
              Next
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-3 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-sm font-semibold group-hover:text-primary transition-colors">{next.title}</span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </nav>
    </DocsLayout>
  )
}
