"use client"

import { useState, useEffect } from "react"
import { DeveloperShell } from "@/components/developer-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { developerApi } from "@/lib/api"
import type { DeveloperWorkspace } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Layers02Icon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  LockKeyIcon,
} from "@hugeicons/core-free-icons"

export default function EnvironmentsPage() {
  const [workspace, setWorkspace] = useState<DeveloperWorkspace | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const data = await developerApi.workspace()
        setWorkspace(data)
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }
    fetchWorkspace()
  }, [])

  if (isLoading) {
    return (
      <DeveloperShell breadcrumb="Environments">
        <div className="flex items-center justify-center py-12"><Spinner className="size-8" /></div>
      </DeveloperShell>
    )
  }

  const steps = workspace?.setup_progress?.steps
  const productionRequirements = [
    { label: "Business Profile", done: steps?.business },
    { label: "KYC Verification", done: steps?.kyc },
    { label: "Selcom Connected", done: steps?.selcom },
    { label: "Webhook Configured", done: steps?.webhook },
    { label: "Test Transaction", done: steps?.test },
  ]
  const allMet = productionRequirements.every((r) => r.done)

  return (
    <DeveloperShell breadcrumb="Environments">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Environments</h1>
        <p className="text-muted-foreground">Manage your sandbox and production environments.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Sandbox */}
        <Card className={`border-none shadow-sm ${workspace?.environment === "SANDBOX" ? "ring-2 ring-primary" : "dark:bg-muted/50"}`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <HugeiconsIcon icon={Layers02Icon} className="size-5" />
                Sandbox
              </span>
              <Badge variant="secondary">Test</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="default">
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-3" /> Active
                  </span>
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Key Prefix</span>
                <code className="font-mono text-xs">sp_test_</code>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base URL</span>
                <code className="font-mono text-xs">api.salamapay.co/test</code>
              </div>
            </div>
            <Separator />
            <p className="text-xs text-muted-foreground">
              Use sandbox for testing. No real transactions are processed.
            </p>
          </CardContent>
        </Card>

        {/* Production */}
        <Card className={`border-none shadow-sm ${workspace?.environment === "PRODUCTION" ? "ring-2 ring-primary" : "dark:bg-muted/50"}`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <HugeiconsIcon icon={Layers02Icon} className="size-5" />
                Production
              </span>
              <Badge variant={workspace?.production_enabled ? "default" : "secondary"}>
                {workspace?.production_enabled ? "Enabled" : "Locked"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={workspace?.production_enabled ? "default" : "secondary"}>
                  {workspace?.production_enabled ? (
                    <span className="flex items-center gap-1">
                      <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-3" /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <HugeiconsIcon icon={LockKeyIcon} className="size-3" /> Locked
                    </span>
                  )}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Key Prefix</span>
                <code className="font-mono text-xs">sp_live_</code>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base URL</span>
                <code className="font-mono text-xs">api.salamapay.co/live</code>
              </div>
            </div>

            {!workspace?.production_enabled && (
              <>
                <Separator />
                <p className="text-xs font-medium">Requirements to enable production:</p>
                <div className="flex flex-col gap-2">
                  {productionRequirements.map((req) => (
                    <div key={req.label} className="flex items-center gap-2 text-sm">
                      <HugeiconsIcon
                        icon={req.done ? CheckmarkCircle01Icon : Cancel01Icon}
                        className={`size-4 ${req.done ? "text-green-500" : "text-muted-foreground"}`}
                      />
                      <span className={req.done ? "" : "text-muted-foreground"}>{req.label}</span>
                    </div>
                  ))}
                </div>
                <Progress value={productionRequirements.filter((r) => r.done).length / productionRequirements.length * 100} className="h-2" />
                <Button disabled={!allMet}>
                  {allMet ? "Request Production Access" : "Complete Requirements First"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DeveloperShell>
  )
}
