"use client"

import { useState, useEffect } from "react"
import { DeveloperShell } from "@/components/developer-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
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
import { Cancel01Icon, RefreshIcon } from "@hugeicons/core-free-icons"

export default function DeliveriesPage() {
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>([])
  const [allDeliveries, setAllDeliveries] = useState<{ delivery: WebhookDelivery; endpoint: WebhookEndpoint }[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  const handleRetry = async (endpointId: string, deliveryId: string) => {
    try {
      await developerApi.retryDelivery(endpointId, deliveryId)
    } catch {
      // ignore
    }
  }

  return (
    <DeveloperShell breadcrumb="Deliveries">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Webhook Deliveries</h1>
        <p className="text-muted-foreground">View all webhook delivery attempts across endpoints.</p>
      </div>

      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8"><Spinner className="size-6" /></div>
          ) : allDeliveries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <HugeiconsIcon icon={Cancel01Icon} className="size-12 text-muted-foreground" />
              <p className="text-muted-foreground">No webhook deliveries yet.</p>
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
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allDeliveries.slice(0, 50).map(({ delivery, endpoint }) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-mono text-sm">{delivery.event_type}</TableCell>
                    <TableCell className="text-sm truncate max-w-[200px]">{endpoint.url}</TableCell>
                    <TableCell>
                      <Badge variant={delivery.status === "DELIVERED" ? "default" : delivery.status === "FAILED" ? "destructive" : "secondary"}>
                        {delivery.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{delivery.response_status || "—"}</TableCell>
                    <TableCell className="text-sm">{delivery.attempt_count}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(delivery.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {delivery.status !== "DELIVERED" && (
                        <Button size="sm" variant="ghost" onClick={() => handleRetry(endpoint.id, delivery.id)}>
                          <HugeiconsIcon icon={RefreshIcon} className="size-4" />
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
    </DeveloperShell>
  )
}
