"use client"

import { AdminPlaceholder } from "@/components/admin-placeholder"
import { HugeiconsIcon } from "@hugeicons/react"
import { Store04Icon } from "@hugeicons/core-free-icons"

export default function AdminBranchesPage() {
  return (
    <AdminPlaceholder
      title="Branches"
      description="SalamaPay office branches are managed in the Departments & Branches page."
      icon={<HugeiconsIcon icon={Store04Icon} className="size-16 text-muted-foreground" />}
      breadcrumb="Branches"
    />
  )
}
