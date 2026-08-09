"use client"

import { AdminPlaceholder } from "@/components/admin-placeholder"
import { HugeiconsIcon } from "@hugeicons/react"
import { ChartColumnIcon } from "@hugeicons/core-free-icons"

export default function AdminRevenuePage() {
  return (
    <AdminPlaceholder
      title="Revenue Reports"
      description="View revenue breakdowns, fee income, and financial reports. Coming soon."
      icon={<HugeiconsIcon icon={ChartColumnIcon} className="size-16 text-muted-foreground" />}
      breadcrumb="Revenue"
    />
  )
}
