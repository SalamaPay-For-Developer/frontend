"use client"

import { DeveloperShell } from "@/components/developer-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  TerminalIcon,
  PlayIcon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"
import { useState } from "react"

const ENDPOINTS = [
  { method: "POST", path: "/v1/checkout/create", description: "Create a checkout session" },
  { method: "GET", path: "/v1/checkout/status", description: "Get checkout status" },
  { method: "POST", path: "/v1/payment/collect", description: "Collect payment (C2B)" },
  { method: "POST", path: "/v1/payment/payout", description: "Payout (disbursement)" },
  { method: "GET", path: "/v1/payment/status", description: "Get payment status" },
  { method: "POST", path: "/v1/utilitypayment/lookup", description: "Utility lookup" },
  { method: "POST", path: "/v1/utilitypayment/process", description: "Utility payment" },
  { method: "GET", path: "/v1/utilitypayment/query", description: "Utility payment status" },
  { method: "POST", path: "/v1/webhooks/test", description: "Send test webhook" },
]

export default function TestConsolePage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(ENDPOINTS[0])
  const [requestBody, setRequestBody] = useState('{\n  "amount": "50000",\n  "currency": "TZS",\n  "order_id": "TEST-001"\n}')
  const [response, setResponse] = useState<string | null>(null)
  const [responseStatus, setResponseStatus] = useState<number | null>(null)
  const [duration, setDuration] = useState<number | null>(null)
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    setSending(true)
    setResponse(null)
    setResponseStatus(null)
    setDuration(null)
    const start = Date.now()
    try {
      // Simulated response for now — actual API calls would go through backend
      await new Promise((r) => setTimeout(r, 500))
      setResponseStatus(200)
      setDuration(Date.now() - start)
      setResponse(JSON.stringify({
        result: "SUCCESS",
        order_id: "TEST-001",
        amount: "50000",
        currency: "TZS",
        checkout_url: "https://pay.salamapay.co/checkout/8XK29A",
      }, null, 2))
    } catch {
      setResponseStatus(500)
      setDuration(Date.now() - start)
      setResponse(JSON.stringify({ error: "Request failed" }, null, 2))
    } finally {
      setSending(false)
    }
  }

  return (
    <DeveloperShell breadcrumb="Test Console">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Test Console</h1>
        <p className="text-muted-foreground">Test API endpoints in a sandbox environment.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Request Panel */}
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={TerminalIcon} className="size-5" />
              Request
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Endpoint</Label>
              <Select
                value={`${selectedEndpoint.method} ${selectedEndpoint.path}`}
                onValueChange={(v) => {
                  const ep = ENDPOINTS.find((e) => `${e.method} ${e.path}` === v)
                  if (ep) setSelectedEndpoint(ep)
                }}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ENDPOINTS.map((ep) => (
                    <SelectItem key={`${ep.method}-${ep.path}`} value={`${ep.method} ${ep.path}`}>
                      <span className="font-mono text-xs">{ep.method}</span> {ep.path}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">{selectedEndpoint.description}</p>
            <Separator />
            <div className="flex flex-col gap-2">
              <Label>Request Body (JSON)</Label>
              <textarea
                className="font-mono text-sm rounded-lg border bg-background p-3 min-h-[200px] resize-y"
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
              />
            </div>
            <Button onClick={handleSend} disabled={sending}>
              <HugeiconsIcon icon={PlayIcon} className="size-4" />
              {sending ? "Sending..." : "Send Request"}
            </Button>
          </CardContent>
        </Card>

        {/* Response Panel */}
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Response</span>
              {responseStatus !== null && (
                <div className="flex items-center gap-2">
                  <Badge variant={responseStatus < 300 ? "default" : "destructive"}>
                    <span className="flex items-center gap-1">
                      <HugeiconsIcon icon={responseStatus < 300 ? CheckmarkCircle01Icon : Cancel01Icon} className="size-3" />
                      {responseStatus}
                    </span>
                  </Badge>
                  {duration !== null && (
                    <Badge variant="outline">{duration}ms</Badge>
                  )}
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {response ? (
              <pre className="text-sm font-mono bg-background rounded-lg border p-3 overflow-auto max-h-[300px]">
                {response}
              </pre>
            ) : (
              <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
                Send a request to see the response.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DeveloperShell>
  )
}
