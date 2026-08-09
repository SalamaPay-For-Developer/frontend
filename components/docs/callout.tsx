import { cn } from "@/lib/utils"
import { ReactNode } from "react"

type CalloutType = "info" | "warning" | "danger" | "success" | "tip"

interface CalloutProps {
  type?: CalloutType
  title?: string
  children: ReactNode
  className?: string
}

const styles: Record<CalloutType, { border: string; bg: string; text: string; icon: string }> = {
  info: { border: "border-blue-200 dark:border-blue-900", bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-900 dark:text-blue-100", icon: "ℹ" },
  warning: { border: "border-orange-200 dark:border-orange-900", bg: "bg-orange-50 dark:bg-orange-950/30", text: "text-orange-900 dark:text-orange-100", icon: "⚠" },
  danger: { border: "border-red-200 dark:border-red-900", bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-900 dark:text-red-100", icon: "✕" },
  success: { border: "border-green-200 dark:border-green-900", bg: "bg-green-50 dark:bg-green-950/30", text: "text-green-900 dark:text-green-100", icon: "✓" },
  tip: { border: "border-purple-200 dark:border-purple-900", bg: "bg-purple-50 dark:bg-purple-950/30", text: "text-purple-900 dark:text-purple-100", icon: "💡" },
}

export function Callout({ type = "info", title, children, className }: CalloutProps) {
  const s = styles[type]
  return (
    <div className={cn("rounded-lg border p-4 my-4", s.border, s.bg, s.text, className)}>
      {title && <p className="font-semibold mb-1">{s.icon} {title}</p>}
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  )
}
