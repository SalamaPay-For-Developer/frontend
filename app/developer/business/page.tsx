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
import { developerApi } from "@/lib/api"
import type { DeveloperWorkspace } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Store04Icon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  SaveIcon,
} from "@hugeicons/core-free-icons"

export default function DeveloperBusinessPage() {
  const [workspace, setWorkspace] = useState<DeveloperWorkspace | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  const [businessName, setBusinessName] = useState("")
  const [supportEmail, setSupportEmail] = useState("")
  const [supportPhone, setSupportPhone] = useState("")
  const [website, setWebsite] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await developerApi.workspace()
        setWorkspace(data)
        setBusinessName(data.business_name || "")
        setSupportEmail(data.support_email || "")
        setSupportPhone(data.support_phone || "")
        setWebsite(data.website || "")
        setDescription(data.description || "")
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
    setError("")
    setSaved(false)
    try {
      const updated = await developerApi.updateWorkspace({
        business_name: businessName,
        support_email: supportEmail,
        support_phone: supportPhone,
        website,
        description,
      } as Partial<DeveloperWorkspace>)
      setWorkspace(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError("Failed to save. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <DeveloperShell breadcrumb="Business Profile">
        <div className="flex items-center justify-center py-12"><Spinner className="size-8" /></div>
      </DeveloperShell>
    )
  }

  return (
    <DeveloperShell breadcrumb="Business Profile">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Business Profile</h1>
        <p className="text-sm text-muted-foreground">Your business information displayed to customers on checkout pages.</p>
      </div>

      {/* Status */}
      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
              <HugeiconsIcon icon={Store04Icon} className="size-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">{workspace?.business_name || "Your Business"}</p>
              <p className="text-xs text-muted-foreground">{workspace?.environment || "SANDBOX"} environment</p>
            </div>
          </div>
          <Badge variant={workspace?.kyc_verified ? "default" : "secondary"}>
            {workspace?.kyc_verified ? "KYC Verified" : "KYC Pending"}
          </Badge>
        </CardContent>
      </Card>

      {/* Editable Info */}
      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardHeader><CardTitle className="text-sm">Business Information</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Business Name</Label>
              <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="My Business Ltd" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Website</Label>
              <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://mybusiness.co.tz" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Support Email</Label>
              <Input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} placeholder="support@mybusiness.co.tz" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Support Phone</Label>
              <Input value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} placeholder="+255 712 345 678" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Description</Label>
            <textarea
              className="rounded-lg border bg-background p-3 text-sm min-h-[80px] resize-y"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your business..."
            />
          </div>
          <Separator />
          {error && <p className="text-sm text-destructive">{error}</p>}
          {saved && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" />
              Changes saved successfully!
            </div>
          )}
          <Button onClick={handleSave} disabled={saving} className="w-fit">
            {saving ? <Spinner className="size-4" /> : <HugeiconsIcon icon={SaveIcon} className="size-4" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Verification Status */}
      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardHeader><CardTitle className="text-sm">Verification Status</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3">
          {[
            { label: "Business Profile", done: !!workspace?.business_name },
            { label: "KYC Verification", done: workspace?.kyc_verified ?? false },
            { label: "Selcom Connected", done: workspace?.selcom_connected ?? false },
            { label: "Webhook Configured", done: workspace?.webhook_configured ?? false },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <HugeiconsIcon
                icon={item.done ? CheckmarkCircle01Icon : Cancel01Icon}
                className={`size-5 ${item.done ? "text-green-500" : "text-muted-foreground"}`}
              />
              <span className={`text-sm ${item.done ? "" : "text-muted-foreground"}`}>{item.label}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </DeveloperShell>
  )
}
