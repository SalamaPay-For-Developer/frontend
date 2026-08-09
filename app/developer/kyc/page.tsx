"use client"

import { DeveloperPlaceholder } from "@/components/developer-placeholder"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkBadgeIcon } from "@hugeicons/core-free-icons"

export default function DeveloperKycPage() {
  return (
    <DeveloperPlaceholder
      title="KYC Verification"
      description="Your KYC status is managed through your SalamaPay business account. Once verified, you can connect Selcom and start building."
      icon={<HugeiconsIcon icon={CheckmarkBadgeIcon} className="size-16 text-muted-foreground" />}
      breadcrumb="KYC"
    />
  )
}
