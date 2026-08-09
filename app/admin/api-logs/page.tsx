"use client"

import { AdminPlaceholder } from "@/components/admin-placeholder"
import { HugeiconsIcon } from "@hugeicons/react"
import { CodeIcon } from "@hugeicons/core-free-icons"

export default function AdminApiLogsPage() {
  return (
    <AdminPlaceholder
      title="API Logs"
      description="View all API requests across developer integrations. Coming soon."
      icon={<HugeiconsIcon icon={CodeIcon} className="size-16 text-muted-foreground" />}
      breadcrumb="API Logs"
    />
  )
}
