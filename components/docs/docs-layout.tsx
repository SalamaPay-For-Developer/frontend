"use client"

import { useState, ReactNode } from "react"
import { DocsHeader } from "./docs-header"
import { DocsSidebar } from "./docs-sidebar"
import { DocsSearch } from "./docs-search"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DocsLayoutProps {
  children: ReactNode
  slug?: string
}

export function DocsLayout({ children, slug }: DocsLayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <DocsHeader onSearchClick={() => setSearchOpen(true)} />
      <DocsSearch open={searchOpen} onOpenChange={setSearchOpen} />

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 border-r">
          <ScrollArea className="h-[calc(100vh-3.5rem)]">
            <div className="px-3 py-6">
              <DocsSidebar />
            </div>
          </ScrollArea>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="mx-auto max-w-4xl px-6 py-10 lg:px-10">
            {children}
          </div>
        </main>

        {/* On this page — will be rendered by page content if needed */}
      </div>
    </div>
  )
}
