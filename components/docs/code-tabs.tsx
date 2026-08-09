"use client"

import { useState } from "react"
import { CodeBlock } from "./code-block"
import { cn } from "@/lib/utils"

interface CodeExample {
  language: string
  label: string
  code: string
}

interface CodeTabsProps {
  examples: CodeExample[]
  className?: string
}

export function CodeTabs({ examples, className }: CodeTabsProps) {
  const [active, setActive] = useState(0)

  return (
    <div className={cn("flex flex-col gap-0", className)}>
      <div className="flex flex-wrap gap-1 border-b">
        {examples.map((ex, i) => (
          <button
            key={ex.language}
            onClick={() => setActive(i)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium transition-colors border-b-2 -mb-px",
              active === i
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {ex.label}
          </button>
        ))}
      </div>
      <CodeBlock code={examples[active].code} language={examples[active].language} />
    </div>
  )
}
