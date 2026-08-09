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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { developerApi, ApiError } from "@/lib/api"
import type { SelcomCredential, ServiceCapability } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PlugSocketIcon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  Key01Icon,
  LockPasswordIcon,
  CheckmarkBadgeIcon,
  Cancel01Icon as DisconnectIcon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"

const SERVICE_LABELS: Record<string, string> = {
  CHECKOUT: "Checkout",
  C2B_COLLECTION: "C2B Collections",
  UTILITY_PAYMENT: "Utility Payments",
  WALLET_CASHIN: "Wallet Cashin",
  QWIKSEND: "Qwiksend (Bank Transfer)",
  WEBHOOKS: "Webhooks",
  VCN: "Virtual Card Numbers",
  IMT: "International Transfer",
  GOVERNMENT: "Government Payments",
}

export default function IntegrationsPage() {
  const [connected, setConnected] = useState(false)
  const [credentials, setCredentials] = useState<SelcomCredential[]>([])
  const [services, setServices] = useState<ServiceCapability[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showConnect, setShowConnect] = useState(false)
  const [env, setEnv] = useState("SANDBOX")
  const [apiKey, setApiKey] = useState("")
  const [apiSecret, setApiSecret] = useState("")
  const [vendorId, setVendorId] = useState("")
  const [pin, setPin] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [conn, svc] = await Promise.all([
          developerApi.selcomConnection().catch(() => null),
          developerApi.services().catch(() => []),
        ])
        if (conn) {
          setConnected(conn.connected)
          setCredentials(conn.credentials)
        }
        setServices(svc)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleConnect = async () => {
    if (!apiKey.trim() || !apiSecret.trim()) {
      setError("API Key and API Secret are required")
      return
    }
    setSubmitting(true)
    setError("")
    try {
      const result = await developerApi.connectSelcom({
        environment: env,
        api_key: apiKey,
        api_secret: apiSecret,
        vendor_id: vendorId || undefined,
        pin: pin || undefined,
      })
      setConnected(true)
      setCredentials([...credentials.filter((c) => c.environment !== env), result.credential])
      setShowConnect(false)
      setApiKey("")
      setApiSecret("")
      setVendorId("")
      setPin("")
      // Refresh services
      const svc = await developerApi.services().catch(() => [])
      setServices(svc)
    } catch (err) {
      if (err instanceof ApiError) {
        const data = err.data as Record<string, unknown>
        const detail = data?.detail
        setError(typeof detail === "string" ? detail : "Failed to connect")
      } else {
        setError("Failed to connect to Selcom")
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect Selcom?")) return
    try {
      await developerApi.disconnectSelcom()
      setConnected(false)
      setCredentials([])
    } catch {
      // ignore
    }
  }

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const result = await developerApi.testSelcom()
      setTestResult(result.status === "SUCCESS" ? "Connection test successful!" : "Connection test failed.")
    } catch {
      setTestResult("Connection test failed.")
    } finally {
      setTesting(false)
    }
  }

  if (isLoading) {
    return (
      <DeveloperShell breadcrumb="Integrations">
        <div className="flex items-center justify-center py-12"><Spinner className="size-8" /></div>
      </DeveloperShell>
    )
  }

  return (
    <DeveloperShell breadcrumb="Integrations">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Connect Selcom</h1>
        <p className="text-muted-foreground">
          Connect your Selcom merchant account to SalamaPay. Credentials are encrypted and stored securely.
        </p>
      </div>

      {/* Connection Status */}
      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <HugeiconsIcon icon={PlugSocketIcon} className="size-5" />
              Selcom Connection
            </span>
            <Badge variant={connected ? "default" : "secondary"}>
              {connected ? (
                <span className="flex items-center gap-1">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-3" /> Connected
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <HugeiconsIcon icon={Cancel01Icon} className="size-3" /> Not Connected
                </span>
              )}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {connected ? (
            <>
              {credentials.map((cred) => (
                <div key={cred.id} className="flex flex-col gap-3 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{cred.environment}</Badge>
                    {cred.last_checked && (
                      <span className="text-xs text-muted-foreground">
                        Last checked: {new Date(cred.last_checked).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">API Key</Label>
                      <p className="font-mono text-sm">{cred.api_key}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">API Secret</Label>
                      <p className="font-mono text-sm">{cred.api_secret}</p>
                    </div>
                    {cred.vendor_id && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Vendor ID</Label>
                        <p className="font-mono text-sm">{cred.vendor_id}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {testResult && (
                <div className={`rounded-md p-3 text-sm ${testResult.includes("successful") ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"}`}>
                  {testResult}
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleTest} disabled={testing}>
                  {testing ? <Spinner className="size-4" /> : <HugeiconsIcon icon={CheckmarkBadgeIcon} className="size-4" />}
                  Test Connection
                </Button>
                <Button variant="outline" onClick={() => setShowConnect(true)}>
                  <HugeiconsIcon icon={RefreshIcon} className="size-4" />
                  Rotate Credentials
                </Button>
                <Button variant="destructive" onClick={handleDisconnect}>
                  <HugeiconsIcon icon={DisconnectIcon} className="size-4" />
                  Disconnect
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <HugeiconsIcon icon={LockPasswordIcon} className="size-12 text-muted-foreground" />
              <p className="text-muted-foreground text-center max-w-md">
                Connect your Selcom merchant account using your API Key and API Secret.
                Your credentials are encrypted and never exposed to the frontend.
              </p>
              <Button onClick={() => setShowConnect(true)}>
                <HugeiconsIcon icon={PlugSocketIcon} className="size-4" />
                Connect Selcom
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Services */}
      {connected && services.length > 0 && (
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardHeader><CardTitle>Services</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  className={`flex items-center gap-3 rounded-lg border p-4 ${svc.is_enabled ? "border-green-500/30 bg-green-500/5" : "border-dashed opacity-60"}`}
                >
                  <HugeiconsIcon
                    icon={svc.is_enabled ? CheckmarkCircle01Icon : Cancel01Icon}
                    className={`size-5 ${svc.is_enabled ? "text-green-500" : "text-muted-foreground"}`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{SERVICE_LABELS[svc.service] || svc.service}</p>
                    {svc.configured_at && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(svc.configured_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connect Dialog */}
      <Dialog open={showConnect} onOpenChange={setShowConnect}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Selcom</DialogTitle>
            <DialogDescription>
              Enter your Selcom API credentials. These will be encrypted and stored securely.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Environment</Label>
              <Select value={env} onValueChange={(v) => setEnv(v || "SANDBOX")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SANDBOX">Sandbox</SelectItem>
                  <SelectItem value="PRODUCTION">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input id="api-key" placeholder="Your Selcom API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="api-secret">API Secret</Label>
              <Input id="api-secret" type="password" placeholder="Your Selcom API Secret" value={apiSecret} onChange={(e) => setApiSecret(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="vendor-id">Vendor ID (Optional)</Label>
              <Input id="vendor-id" placeholder="Your Selcom Vendor ID" value={vendorId} onChange={(e) => setVendorId(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pin">PIN (Optional)</Label>
              <Input id="pin" type="password" placeholder="Your Selcom PIN" value={pin} onChange={(e) => setPin(e.target.value)} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={handleConnect} disabled={submitting}>
              {submitting ? <Spinner className="size-4" /> : <HugeiconsIcon icon={PlugSocketIcon} className="size-4" />}
              Connect Selcom
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DeveloperShell>
  )
}
