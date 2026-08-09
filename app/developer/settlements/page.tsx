"use client"

import { DeveloperPlaceholder } from "@/components/developer-placeholder"
import { HugeiconsIcon } from "@hugeicons/react"
import { BankIcon } from "@hugeicons/core-free-icons"

export default function DeveloperSettlementsPage() {
  return (
    <DeveloperPlaceholder
      title="Developer Settlements"
      description="View settlement reports and manage payouts for your developer integration. Coming soon."
      icon={<HugeiconsIcon icon={BankIcon} className="size-16 text-muted-foreground" />}
      breadcrumb="Settlements"
    />
  )
}
