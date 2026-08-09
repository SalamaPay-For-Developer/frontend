"use client"

import { AdminPlaceholder } from "@/components/admin-placeholder"
import { HugeiconsIcon } from "@hugeicons/react"
import { ChartColumnIcon } from "@hugeicons/core-free-icons"

export default function AdminPipelinePage() {
  return (
    <AdminPlaceholder
      title="Sales Pipeline"
      description="Visualize your sales pipeline from lead to activation. Coming soon."
      icon={<HugeiconsIcon icon={ChartColumnIcon} className="size-16 text-muted-foreground" />}
      breadcrumb="Pipeline"
    />
  )
}
