"use client"

import { DeveloperPlaceholder } from "@/components/developer-placeholder"
import { HugeiconsIcon } from "@hugeicons/react"
import { Store04Icon } from "@hugeicons/core-free-icons"

export default function DeveloperBusinessPage() {
  return (
    <DeveloperPlaceholder
      title="Business Profile"
      description="Your business profile is managed through your SalamaPay account. Complete KYC verification to unlock all developer features."
      icon={<HugeiconsIcon icon={Store04Icon} className="size-16 text-muted-foreground" />}
      breadcrumb="Business Profile"
    />
  )
}
