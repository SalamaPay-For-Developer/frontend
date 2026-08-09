"use client"

import { AdminPlaceholder } from "@/components/admin-placeholder"
import { HugeiconsIcon } from "@hugeicons/react"
import { WebhookIcon } from "@hugeicons/core-free-icons"

export default function AdminWebhooksPage() {
  return (
    <AdminPlaceholder
      title="Webhooks"
      description="Monitor webhook deliveries across all developer integrations. Coming soon."
      icon={<HugeiconsIcon icon={WebhookIcon} className="size-16 text-muted-foreground" />}
      breadcrumb="Webhooks"
    />
  )
}
