"use client"

import { DeveloperPlaceholder } from "@/components/developer-placeholder"
import { HugeiconsIcon } from "@hugeicons/react"
import { Settings05Icon } from "@hugeicons/core-free-icons"

export default function DeveloperSettingsPage() {
  return (
    <DeveloperPlaceholder
      title="Developer Settings"
      description="Configure your developer workspace settings, preferences, and defaults. Coming soon."
      icon={<HugeiconsIcon icon={Settings05Icon} className="size-16 text-muted-foreground" />}
      breadcrumb="Settings"
    />
  )
}
