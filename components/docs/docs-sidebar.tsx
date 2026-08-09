"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { DOC_NAV } from "@/lib/docs-config"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"

export function DocsSidebar() {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<string[]>(
    DOC_NAV.map(s => s.section) // All open by default
  )

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section) 
        : [...prev, section]
    )
  }

  return (
    <nav className="flex flex-col gap-1 pb-20">
      {/* Version Selector */}
      <div className="px-3 mb-4">
        <button className="flex w-full items-center justify-between rounded-md border bg-muted/30 px-3 py-1.5 text-xs font-semibold hover:bg-accent transition-colors">
          <span>v1.0.0</span>
          <HugeiconsIcon icon={ArrowDown01Icon} className="size-3 opacity-50" />
        </button>
      </div>

      {DOC_NAV.map((section) => {
        const isOpen = openSections.includes(section.section)
        return (
          <div key={section.section} className="flex flex-col gap-0.5">
            <button 
              onClick={() => toggleSection(section.section)}
              className="flex items-center justify-between w-full px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 hover:text-foreground transition-colors group"
            >
              {section.section}
              <HugeiconsIcon 
                icon={isOpen ? ArrowDown01Icon : ArrowRight01Icon} 
                className="size-2.5 opacity-0 group-hover:opacity-100 transition-all" 
              />
            </button>
            
            {isOpen && (
              <ul className="flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                {section.items.map((item) => {
                  const href = `/docs/${item.slug}`
                  const isActive = pathname === href
                  return (
                    <li key={item.slug}>
                      <Link
                        href={href}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs transition-all",
                          isActive
                            ? "bg-primary/10 font-bold text-primary border-r-2 border-primary rounded-r-none"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        )}
                      >
                        {item.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )
      })}
    </nav>
  )
}
