"use client"

import { useState, useEffect } from "react"
import { AdminShell } from "@/components/admin-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { adminApi } from "@/lib/api"
import type { AdminTransaction } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, Download01Icon } from "@hugeicons/core-free-icons"

export default function AdminTransactionsPage() {
  const [txns, setTxns] = useState<AdminTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  useEffect(() => { fetchTxns() }, [])

  const fetchTxns = async () => {
    setIsLoading(true)
    try {
      const params: Record<string, string> = {}
      if (search) params.search = search
      if (statusFilter !== "ALL") params.status = statusFilter
      const data = await adminApi.transactions(params)
      setTxns(data)
    } catch { /* ignore */ } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminShell breadcrumb="Transactions">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">All transactions across the platform.</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by reference, business, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchTxns()}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {["ALL", "SUCCESS", "PENDING", "FAILED"].map((s) => (
            <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm"
              onClick={() => { setStatusFilter(s); setTimeout(fetchTxns, 0) }}>
              {s}
            </Button>
          ))}
        </div>
        <Button variant="outline" onClick={() => window.open(adminApi.exportTransactions(), "_blank")}>
          <HugeiconsIcon icon={Download01Icon} className="size-4" />
          Export
        </Button>
      </div>

      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8"><Spinner className="size-6" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {txns.slice(0, 50).map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono text-sm">{t.reference}</TableCell>
                    <TableCell className="text-sm">{t.business_name || "—"}</TableCell>
                    <TableCell className="text-sm">{t.customer_phone || "—"}</TableCell>
                    <TableCell>TZS {Number(t.amount).toLocaleString()}</TableCell>
                    <TableCell><Badge variant="outline">{t.channel_display}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={t.status === "SUCCESS" ? "default" : t.status === "FAILED" ? "destructive" : "secondary"}>
                        {t.status_display}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(t.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  )
}
