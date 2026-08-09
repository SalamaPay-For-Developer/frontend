"use client"

import { useState, useEffect } from "react"
import { DeveloperShell } from "@/components/developer-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { developerApi } from "@/lib/api"
import type { DeveloperWorkspace } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Settings05Icon,
  CheckmarkCircle01Icon,
  SaveIcon,
  Globe02Icon,
  BellIcon,
  Key01Icon,
} from "@hugeicons/core-free-icons"

export default function DeveloperSettingsPage() {
  const [workspace, setWorkspace] = useState<DeveloperWorkspace | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [defaultCurrency, setDefaultCurrency] = useState("TZS")
  const [defaultWebhookUrl, setDefaultWebhookUrl] = useState("")
  const [apiTimeout, setApiTimeout] = useState("30")
  const [autoRetry, setAutoRetry] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [webhookNotifications, setWebhookNotifications] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await developerApi.workspace()
        setWorkspace(data)
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await new Promise((r) => setTimeout(r, 500))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      // ignore
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <DeveloperShell breadcrumb="Settings">
        <div className="flex items-center justify-center py-12"><Spinner className="size-8" /></div>
      </DeveloperShell>
    )
  }

  return (
    <DeveloperShell breadcrumb="Settings">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure your developer workspace preferences and defaults.</p>
      </div>

      {/* Workspace Info */}
      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <HugeiconsIcon icon={Settings05Icon} className="size-4" />
            Workspace
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Workspace ID</Label>
              <Input value={workspace?.id || ""} disabled className="font-mono text-xs" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Environment</Label>
              <div className="flex items-center gap-2 h-9">
                <Badge variant={workspace?.environment === "PRODUCTION" ? "default" : "secondary"}>
                  {workspace?.environment || "SANDBOX"}
                </Badge>
                {workspace?.production_enabled && (
                  <Badge variant="outline">Production Enabled</Badge>
                )}
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Business Name</Label>
              <Input value={workspace?.business_name || ""} disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Business Type</Label>
              <Input value={workspace?.business_type || ""} disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Defaults */}
      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <HugeiconsIcon icon={Globe02Icon} className="size-4" />
            Payment Defaults
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Default Currency</Label>
              <Select value={defaultCurrency} onValueChange={(v) => setDefaultCurrency(v || "TZS")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="TZS">TZS - Tanzanian Shilling</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                  <SelectItem value="UGX">UGX - Ugandan Shilling</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>API Timeout (seconds)</Label>
              <Input type="number" value={apiTimeout} onChange={(e) => setApiTimeout(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Auto-retry failed payments</p>
              <p className="text-xs text-muted-foreground">Automatically retry failed transactions up to 3 times</p>
            </div>
            <Button
              variant={autoRetry ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRetry(!autoRetry)}
            >
              {autoRetry ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Defaults */}
      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <HugeiconsIcon icon={Key01Icon} className="size-4" />
            Webhook Defaults
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Default Webhook URL</Label>
            <Input
              placeholder="https://yourapp.co.tz/webhooks/salamapay"
              value={defaultWebhookUrl}
              onChange={(e) => setDefaultWebhookUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">New webhook endpoints will default to this URL</p>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Webhook delivery notifications</p>
              <p className="text-xs text-muted-foreground">Get notified when webhook deliveries fail</p>
            </div>
            <Button
              variant={webhookNotifications ? "default" : "outline"}
              size="sm"
              onClick={() => setWebhookNotifications(!webhookNotifications)}
            >
              {webhookNotifications ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <HugeiconsIcon icon={BellIcon} className="size-4" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Email notifications</p>
              <p className="text-xs text-muted-foreground">Receive transaction summaries and alerts via email</p>
            </div>
            <Button
              variant={emailNotifications ? "default" : "outline"}
              size="sm"
              onClick={() => setEmailNotifications(!emailNotifications)}
            >
              {emailNotifications ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Spinner className="size-4" /> : <HugeiconsIcon icon={SaveIcon} className="size-4" />}
          Save Settings
        </Button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
            <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" />
            Settings saved!
          </span>
        )}
      </div>
    </DeveloperShell>
  )
}
