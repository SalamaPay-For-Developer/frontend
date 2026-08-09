"use client"

import { DeveloperShell } from "@/components/developer-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { HugeiconsIcon } from "@hugeicons/react"
import { Book02Icon } from "@hugeicons/core-free-icons"

const API_ENDPOINTS = [
  { method: "POST", path: "/v1/checkout/create", description: "Create a checkout session" },
  { method: "GET", path: "/v1/checkout/{order_id}/status", description: "Get checkout status" },
  { method: "POST", path: "/v1/payment/collect", description: "Collect payment (C2B Push USSD)" },
  { method: "POST", path: "/v1/payment/payout", description: "Disburse payment (Payout)" },
  { method: "GET", path: "/v1/payment/status/{transid}", description: "Get payment status" },
  { method: "POST", path: "/v1/utilitypayment/lookup", description: "Utility account lookup" },
  { method: "POST", path: "/v1/utilitypayment/process", description: "Process utility payment" },
  { method: "GET", path: "/v1/utilitypayment/query/{transid}", description: "Utility payment status" },
  { method: "POST", path: "/v1/walletcashin/process", description: "Wallet cashin" },
  { method: "GET", path: "/v1/walletcashin/namelookup", description: "Wallet cashin name lookup" },
  { method: "POST", path: "/v1/qwiksend/process", description: "Bank transfer (Qwiksend)" },
  { method: "GET", path: "/v1/qwiksend/lookup", description: "Bank account name lookup" },
  { method: "GET", path: "/v1/qwiksend/query/{transid}", description: "Qwiksend status" },
  { method: "POST", path: "/v1/webhooks/endpoints", description: "Create webhook endpoint" },
  { method: "GET", path: "/v1/webhooks/endpoints", description: "List webhook endpoints" },
  { method: "POST", path: "/v1/webhooks/{id}/deliveries/{delivery_id}/retry", description: "Retry webhook delivery" },
]

export default function ApiReferencePage() {
  return (
    <DeveloperShell breadcrumb="API Reference" parentLabel="Docs" parentHref="/developer/docs">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">API Reference</h1>
        <p className="text-muted-foreground">Complete list of SalamaPay Developer API endpoints.</p>
      </div>

      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={Book02Icon} className="size-5" />
            Endpoints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {API_ENDPOINTS.map((ep, i) => (
              <div key={`${ep.method}-${ep.path}-${i}`}>
                {i > 0 && <Separator className="my-1" />}
                <div className="flex items-center gap-3 py-2">
                  <Badge
                    variant={ep.method === "GET" ? "secondary" : ep.method === "POST" ? "default" : ep.method === "DELETE" ? "destructive" : "outline"}
                    className="font-mono text-xs w-16 justify-center"
                  >
                    {ep.method}
                  </Badge>
                  <code className="text-sm font-mono flex-1">{ep.path}</code>
                  <span className="text-sm text-muted-foreground hidden md:block">{ep.description}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DeveloperShell>
  )
}
