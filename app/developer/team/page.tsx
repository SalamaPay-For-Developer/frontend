"use client"

import { DeveloperPlaceholder } from "@/components/developer-placeholder"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserGroupIcon } from "@hugeicons/core-free-icons"

export default function DeveloperTeamPage() {
  return (
    <DeveloperPlaceholder
      title="Team Management"
      description="Manage team members and their access to your developer workspace. Coming soon."
      icon={<HugeiconsIcon icon={UserGroupIcon} className="size-16 text-muted-foreground" />}
      breadcrumb="Team"
    />
  )
}
