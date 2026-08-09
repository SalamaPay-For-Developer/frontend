"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { DOC_NAV } from "@/lib/docs-config"

export function DocsSidebar() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-6 pb-20">
      {DOC_NAV.map((section) => (
        <div key={section.section}>
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {section.section}
          </h3>
          <ul className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const href = `/docs/${item.slug}`
              const isActive = pathname === href
              return (
                <li key={item.slug}>
                  <Link
                    href={href}
                    className={cn(
                      "block rounded-lg px-3 py-1.5 text-sm transition-colors",
                      isActive
                        ? "bg-accent font-medium text-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
