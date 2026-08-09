"use client"

import Link from "next/link"
import { ReactNode } from "react"
import { getAdjacentPages } from "@/lib/docs-config"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"

interface DocPageWrapperProps {
  slug: string
  title: string
  description?: string
  children: ReactNode
}

export function DocPageWrapper({ slug, title, description, children }: DocPageWrapperProps) {
  const { prev, next } = getAdjacentPages(slug)

  return (
    <>
      <article className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-lg text-muted-foreground">{description}</p>}
        </header>
        <div className="docs-content flex flex-col gap-4">
          {children}
        </div>
      </article>

      {/* Prev / Next navigation */}
      <nav className="mt-16 flex items-center justify-between gap-4 border-t pt-6">
        {prev ? (
          <Link
            href={`/docs/${prev.slug}`}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-accent transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Previous</span>
              <span className="text-sm font-medium">{prev.title}</span>
            </div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/docs/${next.slug}`}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-accent transition-colors text-right"
          >
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Next</span>
              <span className="text-sm font-medium">{next.title}</span>
            </div>
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4 text-muted-foreground" />
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </>
  )
}
