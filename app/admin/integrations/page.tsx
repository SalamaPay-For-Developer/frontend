"use client"

import { AdminPlaceholder } from "@/components/admin-placeholder"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlugSocketIcon } from "@hugeicons/core-free-icons"

export default function AdminIntegrationsPage() {
  return (
    <AdminPlaceholder
      title="Integrations"
      description="Manage Selcom and third-party integrations. View connection status, API health, and webhook configurations. Coming soon."
      icon={<HugeiconsIcon icon={PlugSocketIcon} className="size-16 text-muted-foreground" />}
      breadcrumb="Integrations"
    />
  )
}
