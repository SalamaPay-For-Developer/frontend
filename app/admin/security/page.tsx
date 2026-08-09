"use client"

import { AdminPlaceholder } from "@/components/admin-placeholder"
import { HugeiconsIcon } from "@hugeicons/react"
import { ShieldKeyIcon } from "@hugeicons/core-free-icons"

export default function AdminSecurityPage() {
  return (
    <AdminPlaceholder
      title="Security Center"
      description="Monitor active sessions, failed logins, 2FA status, API keys, and suspicious activity. Coming soon."
      icon={<HugeiconsIcon icon={ShieldKeyIcon} className="size-16 text-muted-foreground" />}
      breadcrumb="Security"
    />
  )
}
