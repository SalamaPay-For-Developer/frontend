"use client"

import { AdminPlaceholder } from "@/components/admin-placeholder"
import { HugeiconsIcon } from "@hugeicons/react"
import { SentIcon } from "@hugeicons/core-free-icons"

export default function AdminReconciliationPage() {
  return (
    <AdminPlaceholder
      title="Reconciliation"
      description="Reconcile transactions, settlements, and fees. Coming soon."
      icon={<HugeiconsIcon icon={SentIcon} className="size-16 text-muted-foreground" />}
      breadcrumb="Reconciliation"
    />
  )
}
