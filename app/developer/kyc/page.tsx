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
  CheckmarkBadgeIcon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  Clock01Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons"

export default function DeveloperKycPage() {
  const [workspace, setWorkspace] = useState<DeveloperWorkspace | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  if (isLoading) {
    return (
      <DeveloperShell breadcrumb="KYC">
        <div className="flex items-center justify-center py-12"><Spinner className="size-8" /></div>
      </DeveloperShell>
    )
  }

  const kycStatus = workspace?.kyc_status || "PENDING"
  const steps = workspace?.setup_progress?.steps

  const requirements = [
    { label: "Business Registration", desc: "Valid business registration document", done: !!workspace?.business_name },
    { label: "TIN Certificate", desc: "Tax Identification Number certificate", done: steps?.business ?? false },
    { label: "Business License", desc: "Valid business operating license", done: steps?.kyc ?? false },
    { label: "Bank Account Verification", desc: "Business bank account details", done: steps?.kyc ?? false },
    { label: "Director ID", desc: "National ID or passport of director", done: steps?.kyc ?? false },
  ]

  const statusConfig = {
    PENDING: { icon: Clock01Icon, color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Pending Review" },
    APPROVED: { icon: CheckmarkCircle01Icon, color: "text-green-500", bg: "bg-green-500/10", label: "Verified" },
    REJECTED: { icon: Cancel01Icon, color: "text-destructive", bg: "bg-destructive/10", label: "Rejected" },
  }

  const config = statusConfig[kycStatus as keyof typeof statusConfig] || statusConfig.PENDING

  return (
    <DeveloperShell breadcrumb="KYC">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">KYC Verification</h1>
        <p className="text-sm text-muted-foreground">Verify your business to unlock production access and higher limits.</p>
      </div>

      {/* Status Banner */}
      <Card className={`border-none shadow-sm ${config.bg}`}>
        <CardContent className="p-6 flex items-center gap-4">
          <div className={`flex size-14 items-center justify-center rounded-2xl ${config.bg}`}>
            <HugeiconsIcon icon={config.icon} className={`size-7 ${config.color}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{config.label}</h2>
              <Badge variant={kycStatus === "APPROVED" ? "default" : kycStatus === "REJECTED" ? "destructive" : "secondary"}>
                {kycStatus}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {kycStatus === "APPROVED" && "Your business is verified. You have full access to all features."}
              {kycStatus === "PENDING" && "Your documents are under review. This usually takes 1-2 business days."}
              {kycStatus === "REJECTED" && "Some documents were not accepted. Please review and resubmit."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardHeader><CardTitle className="text-sm">Verification Requirements</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3">
          {requirements.map((req) => (
            <div key={req.label} className="flex items-start gap-3 rounded-lg border p-3">
              <HugeiconsIcon
                icon={req.done ? CheckmarkCircle01Icon : Clock01Icon}
                className={`size-5 mt-0.5 ${req.done ? "text-green-500" : "text-muted-foreground"}`}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{req.label}</p>
                <p className="text-xs text-muted-foreground">{req.desc}</p>
              </div>
              <Badge variant={req.done ? "default" : "outline"}>
                {req.done ? "Submitted" : "Required"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Document Upload (placeholder) */}
      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardHeader><CardTitle className="text-sm">Upload Documents</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Business Registration Number</Label>
              <Input placeholder="e.g. 123456" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>TIN Number</Label>
              <Input placeholder="e.g. 123-456-789" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Business License Number</Label>
              <Input placeholder="e.g. BL-2024-001" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Director National ID</Label>
              <Input placeholder="e.g. 19901234-56789-00001-23" />
            </div>
          </div>
          <Separator />
          <div className="rounded-lg border-2 border-dashed p-6 text-center">
            <HugeiconsIcon icon={AlertCircleIcon} className="size-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Document upload (PDF/JPG) will be available after entering the registration numbers above.
            </p>
          </div>
          <Button className="w-fit" disabled={kycStatus === "APPROVED"}>
            <HugeiconsIcon icon={CheckmarkBadgeIcon} className="size-4" />
            {kycStatus === "APPROVED" ? "Already Verified" : "Submit for Review"}
          </Button>
        </CardContent>
      </Card>
    </DeveloperShell>
  )
}
