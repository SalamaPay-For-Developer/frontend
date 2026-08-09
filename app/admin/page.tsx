"use client"

import { useState, useEffect } from "react"
import { AdminShell } from "@/components/admin-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { adminApi } from "@/lib/api"
import type { AdminOverview } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserCircleIcon,
  Store04Icon,
  SentIcon,
  Wallet01Icon,
  CodeIcon,
  CustomerSupportIcon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  ChartColumnIcon,
} from "@hugeicons/core-free-icons"

export default function AdminOverviewPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const data = await adminApi.overview()
        setOverview(data)
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }
    fetchOverview()
  }, [])

  if (isLoading) {
    return (
      <AdminShell breadcrumb="Overview">
        <div className="flex items-center justify-center py-12"><Spinner className="size-8" /></div>
      </AdminShell>
    )
  }

  const stats = [
    { label: "Total Users", value: overview?.total_users || 0, icon: UserCircleIcon, color: "text-blue-500" },
    { label: "Active Users", value: overview?.active_users || 0, icon: CheckmarkCircle01Icon, color: "text-green-500" },
    { label: "New Today", value: overview?.new_registrations || 0, icon: UserCircleIcon, color: "text-blue-500" },
    { label: "Total Businesses", value: overview?.total_businesses || 0, icon: Store04Icon, color: "text-purple-500" },
    { label: "Pending KYC", value: overview?.pending_kyc || 0, icon: Cancel01Icon, color: "text-orange-500" },
    { label: "Verified", value: overview?.verified_businesses || 0, icon: CheckmarkCircle01Icon, color: "text-green-500" },
    { label: "Suspended", value: overview?.suspended_businesses || 0, icon: Cancel01Icon, color: "text-destructive" },
    { label: "Total Transactions", value: overview?.total_transactions || 0, icon: SentIcon, color: "text-blue-500" },
    { label: "Successful", value: overview?.successful_transactions || 0, icon: CheckmarkCircle01Icon, color: "text-green-500" },
    { label: "Failed", value: overview?.failed_transactions || 0, icon: Cancel01Icon, color: "text-destructive" },
    { label: "Pending", value: overview?.pending_transactions || 0, icon: Cancel01Icon, color: "text-orange-500" },
    { label: "Payment Volume", value: `TZS ${Number(overview?.total_payment_volume || 0).toLocaleString()}`, icon: Wallet01Icon, color: "text-green-500" },
    { label: "Today's Revenue", value: `TZS ${Number(overview?.today_revenue || 0).toLocaleString()}`, icon: Wallet01Icon, color: "text-green-500" },
    { label: "Monthly Revenue", value: `TZS ${Number(overview?.monthly_revenue || 0).toLocaleString()}`, icon: ChartColumnIcon, color: "text-blue-500" },
    { label: "Active Developers", value: overview?.active_developers || 0, icon: CodeIcon, color: "text-purple-500" },
    { label: "API Requests", value: overview?.api_requests || 0, icon: CodeIcon, color: "text-blue-500" },
    { label: "Failed API", value: overview?.failed_api_requests || 0, icon: Cancel01Icon, color: "text-destructive" },
    { label: "Open Tickets", value: overview?.open_tickets || 0, icon: CustomerSupportIcon, color: "text-orange-500" },
  ]

  return (
    <AdminShell breadcrumb="Overview">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
        <p className="text-muted-foreground">System-wide statistics and health monitoring.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm dark:bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <HugeiconsIcon icon={stat.icon} className={`size-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminShell>
  )
}
