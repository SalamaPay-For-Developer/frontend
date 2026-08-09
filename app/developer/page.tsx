"use client"

import { useState, useEffect } from "react"
import { DeveloperShell } from "@/components/developer-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Progress } from "@/components/ui/progress"
import { developerApi } from "@/lib/api"
import type { DeveloperOverview as OverviewData, DeveloperWorkspace } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ChartColumnIcon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  Wallet01Icon,
  WebhookIcon,
  CreditCardIcon,
  Key01Icon,
  PlugSocketIcon,
  ArrowLeft01Icon,
  CheckmarkBadgeIcon,
} from "@hugeicons/core-free-icons"
import Link from "next/link"

export default function DeveloperOverviewPage() {
  const [overview, setOverview] = useState<OverviewData | null>(null)
  const [workspace, setWorkspace] = useState<DeveloperWorkspace | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ov, ws] = await Promise.all([
          developerApi.overview().catch(() => null),
          developerApi.workspace().catch(() => null),
        ])
        setOverview(ov)
        setWorkspace(ws)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <DeveloperShell breadcrumb="Overview">
        <div className="flex items-center justify-center py-12"><Spinner className="size-8" /></div>
      </DeveloperShell>
    )
  }

  const steps = workspace?.setup_progress?.steps
  const setupItems = [
    { label: "Business Profile", done: steps?.business, url: "/developer/business", icon: CheckmarkBadgeIcon },
    { label: "KYC Verification", done: steps?.kyc, url: "/developer/kyc", icon: CheckmarkBadgeIcon },
    { label: "Connect Selcom", done: steps?.selcom, url: "/developer/integrations", icon: PlugSocketIcon },
    { label: "Configure Webhook", done: steps?.webhook, url: "/developer/webhooks", icon: WebhookIcon },
    { label: "Test Transaction", done: steps?.test, url: "/developer/console", icon: CreditCardIcon },
    { label: "Production Approval", done: steps?.production, url: "/developer/environments", icon: Key01Icon },
  ]

  return (
    <DeveloperShell breadcrumb="Overview">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Developer Workspace</h1>
          <p className="text-muted-foreground">
            Welcome back{workspace ? `, ${workspace.business_name}` : ""}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={workspace?.environment === "PRODUCTION" ? "default" : "secondary"}>
            {workspace?.environment || "SANDBOX"}
          </Badge>
          <Badge variant={overview?.selcom_connected ? "default" : "outline"}>
            {overview?.selcom_connected ? "Selcom Connected" : "Selcom Not Connected"}
          </Badge>
        </div>
      </div>

      {/* Setup Progress */}
      {workspace && workspace.setup_progress.percentage < 100 && (
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Setup Progress
              <span className="text-sm font-normal text-muted-foreground">
                {workspace.setup_progress.completed}/{workspace.setup_progress.total} completed
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Progress value={workspace.setup_progress.percentage} className="h-2" />
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {setupItems.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 rounded-lg border p-3 ${item.done ? "border-green-500/30 bg-green-500/5" : "border-dashed"}`}
                >
                  <HugeiconsIcon
                    icon={item.done ? CheckmarkCircle01Icon : item.icon}
                    className={`size-5 ${item.done ? "text-green-500" : "text-muted-foreground"}`}
                  />
                  <span className="text-sm flex-1">{item.label}</span>
                  {!item.done && (
                    <Button size="sm" variant="ghost" render={<Link href={item.url} />}>
                      Start
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Requests</CardTitle>
            <HugeiconsIcon icon={ChartColumnIcon} className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.api_requests_total?.toLocaleString() || 0}</div>
            <div className="flex items-center gap-2 mt-1 text-xs">
              <span className="text-green-500 flex items-center gap-1">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-3" />
                {overview?.api_requests_success?.toLocaleString() || 0} success
              </span>
              <span className="text-destructive flex items-center gap-1">
                <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
                {overview?.api_requests_failed?.toLocaleString() || 0} failed
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <HugeiconsIcon icon={Wallet01Icon} className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">TZS {Number(overview?.transactions_total || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <HugeiconsIcon icon={CreditCardIcon} className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">TZS {Number(overview?.transactions_today || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{overview?.active_checkouts || 0} active checkouts</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Webhook Delivery</CardTitle>
            <HugeiconsIcon icon={WebhookIcon} className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.webhook_delivery_rate || 0}%</div>
            <p className="text-xs text-muted-foreground mt-1">Delivered successfully</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button variant="outline" className="h-24 flex-col gap-2 border-dashed" render={<Link href="/developer/checkout" />}>
          <HugeiconsIcon icon={CreditCardIcon} className="size-6" />
          Create Checkout
        </Button>
        <Button variant="outline" className="h-24 flex-col gap-2 border-dashed" render={<Link href="/developer/api-keys" />}>
          <HugeiconsIcon icon={Key01Icon} className="size-6" />
          Generate API Key
        </Button>
        <Button variant="outline" className="h-24 flex-col gap-2 border-dashed" render={<Link href="/developer/webhooks" />}>
          <HugeiconsIcon icon={WebhookIcon} className="size-6" />
          Setup Webhook
        </Button>
        <Button variant="outline" className="h-24 flex-col gap-2 border-dashed" render={<Link href="/developer/console" />}>
          <HugeiconsIcon icon={ChartColumnIcon} className="size-6" />
          Test Console
        </Button>
      </div>

      {/* Back to SalamaPay */}
      <div className="flex justify-center">
        <Button variant="ghost" render={<Link href="/dashboard" />}>
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
          Back to SalamaPay Dashboard
        </Button>
      </div>
    </DeveloperShell>
  )
}
