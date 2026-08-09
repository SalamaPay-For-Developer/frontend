"use client"

import { DeveloperPlaceholder } from "@/components/developer-placeholder"
import { HugeiconsIcon } from "@hugeicons/react"
import { SentIcon } from "@hugeicons/core-free-icons"

export default function DeveloperTransactionsPage() {
  return (
    <DeveloperPlaceholder
      title="Developer Transactions"
      description="View all transactions processed through your developer API integration. Coming soon."
      icon={<HugeiconsIcon icon={SentIcon} className="size-16 text-muted-foreground" />}
      breadcrumb="Transactions"
    />
  )
}
