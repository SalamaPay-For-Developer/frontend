"use client"

import { useState, useEffect, useMemo } from "react"
import { DeveloperShell } from "@/components/developer-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { developerApi } from "@/lib/api"
import type { WebhookEndpoint, WebhookDelivery } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ChartColumnIcon,
  Search01Icon,
  RefreshIcon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons"

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive"> = {
  DELIVERED: "default",
  FAILED: "destructive",
  PENDING: "secondary",
  RETRYING: "secondary",
}

export default function WebhookLogsPage() {
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>([])
  const [allDeliveries, setAllDeliveries] = useState<{ delivery: WebhookDelivery; endpoint: WebhookEndpoint }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [selectedDelivery, setSelectedDelivery] = useState<{ delivery: WebhookDelivery; endpoint: WebhookEndpoint } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eps = await developerApi.webhooks()
        setEndpoints(eps)
        const deliveryPromises = eps.map(async (ep) => {
          try {
            const dels = await developerApi.webhookDeliveries(ep.id)
            return dels.map((d) => ({ delivery: d, endpoint: ep }))
          } catch {
            return []
          }
        })
        const results = await Promise.all(deliveryPromises)
        setAllDeliveries(results.flat().sort((a, b) =>
          new Date(b.delivery.created_at).getTime() - new Date(a.delivery.created_at).getTime()
        ))
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtered = useMemo(() => {
    return allDeliveries.filter(({ delivery }) => {
      const matchesSearch = !search ||
        delivery.event_type.toLowerCase().includes(search.toLowerCase()) ||
        (delivery.transaction_ref || "").toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === "ALL" || delivery.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [allDeliveries, search, statusFilter])

  const handleRetry = async (endpointId: string, deliveryId: string) => {
    try {
      await developerApi.retryDelivery(endpointId, deliveryId)
    } catch {
      // ignore
    }
  }

  const stats = useMemo(() => {
    const total = allDeliveries.length
    const delivered = allDeliveries.filter((d) => d.delivery.status === "DELIVERED").length
    const failed = allDeliveries.filter((d) => d.delivery.status === "FAILED").length
    const pending = allDeliveries.filter((d) => d.delivery.status === "PENDING" || d.delivery.status === "RETRYING").length
    return { total, delivered, failed, pending }
  }, [allDeliveries])

  return (
    <DeveloperShell breadcrumb="Webhook Logs">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Webhook Logs</h1>
        <p className="text-sm text-muted-foreground">Detailed logs of webhook events and delivery attempts.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Events</p>
            <p className="text-xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Delivered</p>
            <p className="text-xl font-bold text-green-500">{stats.delivered}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Failed</p>
            <p className="text-xl font-bold text-destructive">{stats.failed}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-xl font-bold text-yellow-500">{stats.pending}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[140px] max-w-sm">
          <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search by event or transaction..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-1.5">
          {["ALL", "DELIVERED", "FAILED", "PENDING", "RETRYING"].map((s) => (
            <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(s)}>
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>
      </div>

      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8"><Spinner className="size-6" /></div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <HugeiconsIcon icon={ChartColumnIcon} className="size-12 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">No webhook events found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Response</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.slice(0, 100).map(({ delivery, endpoint }) => (
                  <TableRow key={delivery.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedDelivery({ delivery, endpoint })}>
                    <TableCell className="font-mono text-xs">{delivery.event_type}</TableCell>
                    <TableCell className="text-xs truncate max-w-[160px]">{endpoint.url}</TableCell>
                    <TableCell><Badge variant={STATUS_VARIANTS[delivery.status] || "secondary"}>{delivery.status}</Badge></TableCell>
                    <TableCell className="text-xs">{delivery.response_status || "—"}</TableCell>
                    <TableCell className="text-xs">{delivery.attempt_count}</TableCell>
                    <TableCell className="font-mono text-xs">{delivery.transaction_ref || "—"}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{new Date(delivery.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      {delivery.status !== "DELIVERED" && (
                        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleRetry(endpoint.id, delivery.id) }}>
                          <HugeiconsIcon icon={RefreshIcon} className="size-3" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedDelivery} onOpenChange={(open) => !open && setSelectedDelivery(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Webhook Event Detail</DialogTitle>
          </DialogHeader>
          {selectedDelivery && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Event Type: </span>
                  <Badge variant="outline">{selectedDelivery.delivery.event_type}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Status: </span>
                  <Badge variant={STATUS_VARIANTS[selectedDelivery.delivery.status] || "secondary"}>{selectedDelivery.delivery.status}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Endpoint: </span>
                  <span className="text-xs font-mono">{selectedDelivery.endpoint.url}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Attempts: </span>
                  <span>{selectedDelivery.delivery.attempt_count}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Response Status: </span>
                  <span>{selectedDelivery.delivery.response_status || "—"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Transaction: </span>
                  <span className="font-mono text-xs">{selectedDelivery.delivery.transaction_ref || "—"}</span>
                </div>
                {selectedDelivery.delivery.delivered_at && (
                  <div>
                    <span className="text-muted-foreground">Delivered At: </span>
                    <span>{new Date(selectedDelivery.delivery.delivered_at).toLocaleString()}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Created: </span>
                  <span>{new Date(selectedDelivery.delivery.created_at).toLocaleString()}</span>
                </div>
              </div>
              {selectedDelivery.delivery.error_message && (
                <div>
                  <p className="text-sm font-medium mb-1">Error Message</p>
                  <div className="rounded-lg bg-destructive/5 border border-destructive/10 p-3 text-sm text-destructive">
                    {selectedDelivery.delivery.error_message}
                  </div>
                </div>
              )}
              {selectedDelivery.delivery.payload && Object.keys(selectedDelivery.delivery.payload).length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-1">Payload</p>
                  <pre className="text-xs font-mono bg-muted p-3 rounded-lg overflow-auto max-h-60">
                    {JSON.stringify(selectedDelivery.delivery.payload, null, 2)}
                  </pre>
                </div>
              )}
              {selectedDelivery.delivery.response_body && (
                <div>
                  <p className="text-sm font-medium mb-1">Response Body</p>
                  <pre className="text-xs font-mono bg-muted p-3 rounded-lg overflow-auto max-h-40">
                    {selectedDelivery.delivery.response_body}
                  </pre>
                </div>
              )}
              {selectedDelivery.delivery.status !== "DELIVERED" && (
                <Button variant="outline" onClick={() => handleRetry(selectedDelivery.endpoint.id, selectedDelivery.delivery.id)}>
                  <HugeiconsIcon icon={RefreshIcon} className="size-4" />
                  Retry Delivery
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DeveloperShell>
  )
}
