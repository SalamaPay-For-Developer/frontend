"use client"

import { useState, useEffect } from "react"
import { AdminShell } from "@/components/admin-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { adminApi } from "@/lib/api"
import type { PaymentService } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { CreditCardIcon } from "@hugeicons/core-free-icons"

const STATUS_BADGE: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  ACTIVE: "default",
  INACTIVE: "secondary",
  MAINTENANCE: "destructive",
  RESTRICTED: "outline",
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<PaymentService[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setServices(await adminApi.paymentServices())
      } catch { /* ignore */ } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const cycleStatus = async (s: PaymentService) => {
    const statuses = ["ACTIVE", "INACTIVE", "MAINTENANCE", "RESTRICTED"]
    const idx = statuses.indexOf(s.status)
    const next = statuses[(idx + 1) % statuses.length]
    try {
      const updated = await adminApi.updatePaymentService(s.id, { status: next as PaymentService["status"] })
      setServices(services.map((x) => x.id === updated.id ? updated : x))
    } catch { /* ignore */ }
  }

  if (isLoading) {
    return (
      <AdminShell breadcrumb="Payment Services">
        <div className="flex items-center justify-center py-12"><Spinner className="size-8" /></div>
      </AdminShell>
    )
  }

  return (
    <AdminShell breadcrumb="Payment Services">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Payment Services</h1>
        <p className="text-muted-foreground">Enable, disable, or restrict payment services.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Card key={s.id} className="border-none shadow-sm dark:bg-muted/50">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <HugeiconsIcon icon={CreditCardIcon} className="size-5" />
                </div>
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.code}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant={STATUS_BADGE[s.status] || "outline"}>{s.status}</Badge>
                <Button size="sm" variant="ghost" onClick={() => cycleStatus(s)}>Toggle</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminShell>
  )
}
