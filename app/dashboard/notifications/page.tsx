"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  BellIcon,
  CreditCardIcon,
  CheckmarkBadgeIcon,
  BankIcon,
  Alert02Icon,
  Settings05Icon,
} from "@hugeicons/core-free-icons"

const NOTIFICATION_ICONS: Record<string, typeof BellIcon> = {
  PAYMENT: CreditCardIcon,
  TRANSACTION: CreditCardIcon,
  KYC: CheckmarkBadgeIcon,
  SETTLEMENT: BankIcon,
  SECURITY: Alert02Icon,
  SYSTEM: Settings05Icon,
}

const NOTIFICATION_COLORS: Record<string, string> = {
  PAYMENT: "text-green-500 bg-green-500/10",
  TRANSACTION: "text-blue-500 bg-blue-500/10",
  KYC: "text-purple-500 bg-purple-500/10",
  SETTLEMENT: "text-yellow-500 bg-yellow-500/10",
  SECURITY: "text-destructive bg-destructive/10",
  SYSTEM: "text-muted-foreground bg-muted",
}

export default function NotificationsPage() {
  return (
    <DashboardShell breadcrumb="Notifications">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Stay updated on your account activity.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <HugeiconsIcon icon={BellIcon} className="size-12 text-muted-foreground" />
            <p className="text-muted-foreground">No notifications yet.</p>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
