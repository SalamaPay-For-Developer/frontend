"use client"

import { DeveloperPlaceholder } from "@/components/developer-placeholder"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"

export default function DeveloperCollectionsPage() {
  return (
    <DeveloperPlaceholder
      title="C2B Collections"
      description="Collect payments from customers via mobile money push (USSD). Configure collection flows and track status. Coming soon."
      icon={<HugeiconsIcon icon={ArrowDown01Icon} className="size-16 text-muted-foreground" />}
      breadcrumb="Collections"
    />
  )
}
