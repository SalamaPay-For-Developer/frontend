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
  ShieldKeyIcon,
  PlusSignIcon,
  Cancel01Icon,
  Globe02Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons"

export default function SecurityPage() {
  const [workspace, setWorkspace] = useState<DeveloperWorkspace | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newDomain, setNewDomain] = useState("")
  const [newIp, setNewIp] = useState("")

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

  const addDomain = async () => {
    if (!newDomain.trim() || !workspace) return
    const updated = [...(workspace.allowed_domains || []), newDomain]
    try {
      const ws = await developerApi.updateWorkspace({ allowed_domains: updated } as Partial<DeveloperWorkspace>)
      setWorkspace(ws)
      setNewDomain("")
    } catch {
      // ignore
    }
  }

  const removeDomain = async (domain: string) => {
    if (!workspace) return
    const updated = (workspace.allowed_domains || []).filter((d) => d !== domain)
    try {
      const ws = await developerApi.updateWorkspace({ allowed_domains: updated } as Partial<DeveloperWorkspace>)
      setWorkspace(ws)
    } catch {
      // ignore
    }
  }

  const addIp = async () => {
    if (!newIp.trim() || !workspace) return
    const updated = [...(workspace.ip_allowlist || []), newIp]
    try {
      const ws = await developerApi.updateWorkspace({ ip_allowlist: updated } as Partial<DeveloperWorkspace>)
      setWorkspace(ws)
      setNewIp("")
    } catch {
      // ignore
    }
  }

  const removeIp = async (ip: string) => {
    if (!workspace) return
    const updated = (workspace.ip_allowlist || []).filter((i) => i !== ip)
    try {
      const ws = await developerApi.updateWorkspace({ ip_allowlist: updated } as Partial<DeveloperWorkspace>)
      setWorkspace(ws)
    } catch {
      // ignore
    }
  }

  if (isLoading) {
    return (
      <DeveloperShell breadcrumb="Security">
        <div className="flex items-center justify-center py-12"><Spinner className="size-8" /></div>
      </DeveloperShell>
    )
  }

  return (
    <DeveloperShell breadcrumb="Security">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Security Center</h1>
        <p className="text-muted-foreground">Manage API security, allowed domains, IP allowlist, and more.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Allowed Domains */}
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={Globe02Icon} className="size-5" />
              Allowed Domains
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Only requests from these domains will be accepted for public key authentication.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="https://myshop.co.tz"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addDomain()}
              />
              <Button onClick={addDomain}>
                <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {(workspace?.allowed_domains || []).length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">No domains configured. All domains are allowed.</p>
              ) : (
                workspace?.allowed_domains?.map((domain) => (
                  <div key={domain} className="flex items-center justify-between rounded-lg border p-2">
                    <code className="text-sm font-mono">{domain}</code>
                    <Button size="sm" variant="ghost" onClick={() => removeDomain(domain)}>
                      <HugeiconsIcon icon={Cancel01Icon} className="size-4 text-destructive" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* IP Allowlist */}
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={ShieldKeyIcon} className="size-5" />
              IP Allowlist
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Restrict API access to specific IP addresses. Leave empty to allow all.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="192.168.1.1"
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addIp()}
              />
              <Button onClick={addIp}>
                <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {(workspace?.ip_allowlist || []).length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">No IPs configured. All IPs are allowed.</p>
              ) : (
                workspace?.ip_allowlist?.map((ip) => (
                  <div key={ip} className="flex items-center justify-between rounded-lg border p-2">
                    <code className="text-sm font-mono">{ip}</code>
                    <Button size="sm" variant="ghost" onClick={() => removeIp(ip)}>
                      <HugeiconsIcon icon={Cancel01Icon} className="size-4 text-destructive" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Checklist */}
      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardHeader><CardTitle>Security Checklist</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3">
          {[
            { label: "API Keys secured (never exposed to frontend)", done: true },
            { label: "Selcom credentials encrypted", done: workspace?.selcom_connected ?? false },
            { label: "Webhook secret configured", done: workspace?.webhook_configured ?? false },
            { label: "Allowed domains configured", done: (workspace?.allowed_domains || []).length > 0 },
            { label: "IP allowlist configured", done: (workspace?.ip_allowlist || []).length > 0 },
            { label: "2FA enabled", done: false },
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
