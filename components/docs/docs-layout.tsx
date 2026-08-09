"use client"

import { useState, ReactNode, useEffect } from "react"
import { DocsHeader } from "./docs-header"
import { DocsSidebar } from "./docs-sidebar"
import { DocsSearch } from "./docs-search"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface DocsLayoutProps {
  children: ReactNode
  headings?: { id: string; title: string; level: number }[]
}

export function DocsLayout({ children, headings = [] }: DocsLayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-80px 0% -80% 0%" }
    )

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DocsHeader onSearchClick={() => setSearchOpen(true)} />
      <DocsSearch open={searchOpen} onOpenChange={setSearchOpen} />

      <div className="container mx-auto flex flex-1 items-start gap-0">
        {/* Left Sidebar */}
        <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 border-r md:sticky lg:block lg:w-64">
          <ScrollArea className="h-full py-6 pr-6 lg:py-8">
            <DocsSidebar />
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="relative flex-1 py-6 lg:py-10 lg:px-10 min-w-0">
          <div className="mx-auto max-w-3xl">
            {children}
          </div>
        </main>

        {/* Right Sidebar - "On this page" */}
        {headings.length > 0 && (
          <aside className="sticky top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 xl:block">
            <ScrollArea className="h-full py-10 pl-6">
              <div className="space-y-4">
                <p className="text-sm font-bold tracking-tight">On this page</p>
                <ul className="space-y-2.5">
                  {headings.map((heading) => (
                    <li 
                      key={heading.id}
                      style={{ paddingLeft: `${(heading.level - 2) * 1}rem` }}
                    >
                      <a
                        href={`#${heading.id}`}
                        className={cn(
                          "block text-xs transition-colors hover:text-foreground",
                          activeId === heading.id
                            ? "font-medium text-foreground"
                            : "text-muted-foreground"
                        )}
                        onClick={(e) => {
                          e.preventDefault()
                          document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" })
                        }}
                      >
                        {heading.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollArea>
          </aside>
        )}
      </div>
    </div>
  )
}
