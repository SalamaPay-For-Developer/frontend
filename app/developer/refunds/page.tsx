"use client"

import { DeveloperPlaceholder } from "@/components/developer-placeholder"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUp01Icon } from "@hugeicons/core-free-icons"

export default function DeveloperRefundsPage() {
  return (
    <DeveloperPlaceholder
      title="Refunds"
      description="Process and track refunds for transactions processed through your integration. Coming soon."
      icon={<HugeiconsIcon icon={ArrowUp01Icon} className="size-16 text-muted-foreground" />}
      breadcrumb="Refunds"
    />
  )
}
