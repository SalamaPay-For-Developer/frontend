"use client"

import { AdminPlaceholder } from "@/components/admin-placeholder"
import { HugeiconsIcon } from "@hugeicons/react"
import { BankIcon } from "@hugeicons/core-free-icons"

export default function AdminSettlementsPage() {
  return (
    <AdminPlaceholder
      title="Settlements"
      description="View and process settlements. Reconciliation tools coming soon."
      icon={<HugeiconsIcon icon={BankIcon} className="size-16 text-muted-foreground" />}
      breadcrumb="Settlements"
    />
  )
}
