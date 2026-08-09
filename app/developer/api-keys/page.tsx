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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { developerApi } from "@/lib/api"
import type { SalamaPayApiKey } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Key01Icon,
  PlusSignIcon,
  RefreshIcon,
  Copy01Icon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<SalamaPayApiKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [keyType, setKeyType] = useState("SECRET")
  const [environment, setEnvironment] = useState("SANDBOX")
  const [submitting, setSubmitting] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const data = await developerApi.apiKeys()
        setKeys(data)
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }
    fetchKeys()
  }, [])

  const handleCreate = async () => {
    setSubmitting(true)
    setError("")
    try {
      const result = await developerApi.createApiKey({ key_type: keyType, environment })
      setKeys([...keys, result.api_key])
      setNewKey(result.key)
      setShowCreate(false)
    } catch {
      setError("Failed to create API key")
    } finally {
      setSubmitting(false)
    }
  }

  const handleRotate = async (id: string) => {
    if (!confirm("Are you sure? The old key will be deactivated immediately.")) return
    try {
      const result = await developerApi.rotateApiKey(id)
      setKeys(keys.map((k) => (k.id === id ? result.api_key : k)))
      setNewKey(result.key)
    } catch {
      // ignore
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this API key? This cannot be undone.")) return
    try {
      await developerApi.deleteApiKey(id)
      setKeys(keys.filter((k) => k.id !== id))
    } catch {
      // ignore
    }
  }

  const copyKey = () => {
    if (newKey) {
      navigator.clipboard.writeText(newKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <DeveloperShell breadcrumb="API Keys">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground">Manage your SalamaPay API keys for sandbox and production.</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          Generate Key
        </Button>
      </div>

      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardHeader><CardTitle>Your API Keys</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8"><Spinner className="size-6" /></div>
          ) : keys.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <HugeiconsIcon icon={Key01Icon} className="size-12 text-muted-foreground" />
              <p className="text-muted-foreground">No API keys yet. Generate one to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-mono text-sm">{key.key_prefix}...</TableCell>
                    <TableCell>
                      <Badge variant="outline">{key.key_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={key.environment === "PRODUCTION" ? "default" : "secondary"}>
                        {key.environment}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={key.is_active ? "default" : "secondary"}>
                        {key.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {key.last_used ? new Date(key.last_used).toLocaleDateString() : "Never"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleRotate(key.id)}>
                          <HugeiconsIcon icon={RefreshIcon} className="size-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(key.id)}>
                          <HugeiconsIcon icon={Cancel01Icon} className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate API Key</DialogTitle>
            <DialogDescription>Create a new API key. Save it securely — it won't be shown again.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Key Type</Label>
              <Select value={keyType} onValueChange={(v) => setKeyType(v || "SECRET")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLIC">Public Key</SelectItem>
                  <SelectItem value="SECRET">Secret Key</SelectItem>
                  <SelectItem value="WEBHOOK">Webhook Secret</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Environment</Label>
              <Select value={environment} onValueChange={(v) => setEnvironment(v || "SANDBOX")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SANDBOX">Sandbox</SelectItem>
                  <SelectItem value="PRODUCTION">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={handleCreate} disabled={submitting}>
              {submitting ? <Spinner className="size-4" /> : <HugeiconsIcon icon={Key01Icon} className="size-4" />}
              Generate
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Key Display Dialog */}
      <Dialog open={!!newKey} onOpenChange={(open) => !open && setNewKey(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>API Key Generated</DialogTitle>
            <DialogDescription>
              Save this key securely. It will not be shown again.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border bg-muted p-3">
              <code className="text-sm break-all font-mono">{newKey}</code>
            </div>
            <Button onClick={copyKey} variant="outline">
              <HugeiconsIcon icon={copied ? CheckmarkCircle01Icon : Copy01Icon} className="size-4" />
              {copied ? "Copied!" : "Copy Key"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DeveloperShell>
  )
}
