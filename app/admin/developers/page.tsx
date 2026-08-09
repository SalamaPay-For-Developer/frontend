"use client"

import { AdminPlaceholder } from "@/components/admin-placeholder"
import { HugeiconsIcon } from "@hugeicons/react"
import { CodeIcon } from "@hugeicons/core-free-icons"

export default function AdminDevelopersPage() {
  return (
    <AdminPlaceholder
      title="Developer Accounts"
      description="View and manage all developer workspaces, API usage, and integrations. Coming soon."
      icon={<HugeiconsIcon icon={CodeIcon} className="size-16 text-muted-foreground" />}
      breadcrumb="Developer Accounts"
    />
  )
}
