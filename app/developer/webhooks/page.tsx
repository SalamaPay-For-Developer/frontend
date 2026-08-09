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
import type { WebhookEndpoint, WebhookDelivery } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  WebhookIcon,
  PlusSignIcon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  RefreshIcon,
  Copy01Icon,
} from "@hugeicons/core-free-icons"

const WEBHOOK_EVENTS = [
  "payment.success",
  "payment.failed",
  "payment.pending",
  "payment.reversed",
  "payment.refunded",
  "settlement.completed",
]

export default function WebhooksPage() {
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["payment.success", "payment.failed"])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [deliveries, setDeliveries] = useState<Record<string, WebhookDelivery[]>>({})
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null)
  const [copiedSecret, setCopiedSecret] = useState<string | null>(null)

  useEffect(() => {
    const fetchEndpoints = async () => {
      try {
        const data = await developerApi.webhooks()
        setEndpoints(data)
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }
    fetchEndpoints()
  }, [])

  const toggleEvent = (event: string) => {
    if (selectedEvents.includes(event)) {
      setSelectedEvents(selectedEvents.filter((e) => e !== event))
    } else {
      setSelectedEvents([...selectedEvents, event])
    }
  }

  const handleCreate = async () => {
    if (!url.trim()) {
      setError("URL is required")
      return
    }
    setSubmitting(true)
    setError("")
    try {
      const endpoint = await developerApi.createWebhook({
        url,
        description: description || undefined,
        events: selectedEvents,
      })
      setEndpoints([...endpoints, endpoint])
      setShowCreate(false)
      setUrl("")
      setDescription("")
      setSelectedEvents(["payment.success", "payment.failed"])
    } catch {
      setError("Failed to create webhook endpoint")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this webhook endpoint?")) return
    try {
      await developerApi.deleteWebhook(id)
      setEndpoints(endpoints.filter((e) => e.id !== id))
    } catch {
      // ignore
    }
  }

  const loadDeliveries = async (endpointId: string) => {
    if (expandedEndpoint === endpointId) {
      setExpandedEndpoint(null)
      return
    }
    setExpandedEndpoint(endpointId)
    if (!deliveries[endpointId]) {
      try {
        const data = await developerApi.webhookDeliveries(endpointId)
        setDeliveries({ ...deliveries, [endpointId]: data })
      } catch {
        // ignore
      }
    }
  }

  const handleRetry = async (webhookId: string, deliveryId: string) => {
    try {
      await developerApi.retryDelivery(webhookId, deliveryId)
      // Refresh deliveries
      const data = await developerApi.webhookDeliveries(webhookId)
      setDeliveries({ ...deliveries, [webhookId]: data })
    } catch {
      // ignore
    }
  }

  const copySecret = (id: string, secret: string) => {
    navigator.clipboard.writeText(secret)
    setCopiedSecret(id)
    setTimeout(() => setCopiedSecret(null), 2000)
  }

  return (
    <DeveloperShell breadcrumb="Webhooks">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Webhooks</h1>
          <p className="text-muted-foreground">Configure webhook endpoints to receive real-time event notifications.</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          Add Endpoint
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><Spinner className="size-8" /></div>
      ) : endpoints.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
            <HugeiconsIcon icon={WebhookIcon} className="size-12 text-muted-foreground" />
            <p className="text-muted-foreground">No webhook endpoints configured.</p>
            <Button onClick={() => setShowCreate(true)}>
              <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
              Add Endpoint
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {endpoints.map((ep) => (
            <Card key={ep.id} className="border-none shadow-sm dark:bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-base">
                    <HugeiconsIcon icon={WebhookIcon} className="size-4" />
                    <span className="truncate max-w-[400px]">{ep.url}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant={ep.status === "ACTIVE" ? "default" : "secondary"}>{ep.status}</Badge>
                    <Badge variant="outline">{ep.delivery_rate}% delivered</Badge>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(ep.id)}>
                      <HugeiconsIcon icon={Cancel01Icon} className="size-4 text-destructive" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {ep.description && <p className="text-sm text-muted-foreground">{ep.description}</p>}
                <div className="flex flex-wrap gap-1">
                  {ep.events.map((event) => (
                    <Badge key={event} variant="outline" className="text-xs">{event}</Badge>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total: </span>
                    <span className="font-medium">{ep.total_deliveries}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Success: </span>
                    <span className="font-medium text-green-500">{ep.successful_deliveries}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Failed: </span>
                    <span className="font-medium text-destructive">{ep.failed_deliveries}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                    {ep.secret?.substring(0, 12)}...
                  </code>
                  <Button size="sm" variant="ghost" onClick={() => copySecret(ep.id, ep.secret)}>
                    <HugeiconsIcon icon={copiedSecret === ep.id ? CheckmarkCircle01Icon : Copy01Icon} className="size-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={() => loadDeliveries(ep.id)}>
                  {expandedEndpoint === ep.id ? "Hide" : "View"} Deliveries
                </Button>

                {expandedEndpoint === ep.id && deliveries[ep.id] && (
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Event</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Response</TableHead>
                          <TableHead>Attempts</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deliveries[ep.id].length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                              No deliveries yet.
                            </TableCell>
                          </TableRow>
                        ) : (
                          deliveries[ep.id].map((del) => (
                            <TableRow key={del.id}>
                              <TableCell className="font-mono text-sm">{del.event_type}</TableCell>
                              <TableCell>
                                <Badge variant={del.status === "DELIVERED" ? "default" : del.status === "FAILED" ? "destructive" : "secondary"}>
                                  {del.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">{del.response_status || "—"}</TableCell>
                              <TableCell className="text-sm">{del.attempt_count}</TableCell>
                              <TableCell>
                                {del.status !== "DELIVERED" && (
                                  <Button size="sm" variant="ghost" onClick={() => handleRetry(ep.id, del.id)}>
                                    <HugeiconsIcon icon={RefreshIcon} className="size-4" />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Webhook Endpoint</DialogTitle>
            <DialogDescription>Configure a URL to receive event notifications.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="wh-url">Endpoint URL</Label>
              <Input id="wh-url" placeholder="https://example.com/api/salamapay/webhook" value={url} onChange={(e) => setUrl(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="wh-desc">Description (Optional)</Label>
              <Input id="wh-desc" placeholder="Production webhook" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Events to Subscribe</Label>
              <div className="flex flex-col gap-2">
                {WEBHOOK_EVENTS.map((event) => (
                  <button
                    key={event}
                    type="button"
                    onClick={() => toggleEvent(event)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      selectedEvents.includes(event) ? "border-primary bg-primary/5" : "border-dashed"
                    }`}
                  >
                    <HugeiconsIcon
                      icon={selectedEvents.includes(event) ? CheckmarkCircle01Icon : WebhookIcon}
                      className={`size-4 ${selectedEvents.includes(event) ? "text-primary" : "text-muted-foreground"}`}
                    />
                    {event}
                  </button>
                ))}
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={handleCreate} disabled={submitting}>
              {submitting ? <Spinner className="size-4" /> : <HugeiconsIcon icon={PlusSignIcon} className="size-4" />}
              Create Endpoint
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DeveloperShell>
  )
}
