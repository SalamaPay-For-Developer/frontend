"use client"

import { DeveloperPlaceholder } from "@/components/developer-placeholder"
import { HugeiconsIcon } from "@hugeicons/react"
import { ChartColumnIcon } from "@hugeicons/core-free-icons"

export default function WebhookLogsPage() {
  return (
    <DeveloperPlaceholder
      title="Webhook Logs"
      description="Detailed logs of webhook events and delivery attempts. View payload, response, and retry history. Coming soon."
      icon={<HugeiconsIcon icon={ChartColumnIcon} className="size-16 text-muted-foreground" />}
      breadcrumb="Webhook Logs"
    />
  )
}
