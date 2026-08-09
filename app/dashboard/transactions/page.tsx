"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  DialogDescription,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { paymentsApi } from "@/lib/api"
import type { Transaction, TransactionReceipt } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  Download04Icon,
  Download01Icon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons"

const STATUS_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  SUCCESS: "default",
  PENDING: "secondary",
  PROCESSING: "secondary",
  FAILED: "destructive",
  REVERSED: "destructive",
  EXPIRED: "outline",
}

const STATUS_ICONS: Record<string, typeof CheckmarkCircle01Icon> = {
  SUCCESS: CheckmarkCircle01Icon,
  PENDING: Clock01Icon,
  PROCESSING: Clock01Icon,
  FAILED: Cancel01Icon,
  REVERSED: Cancel01Icon,
  EXPIRED: Cancel01Icon,
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [selectedRef, setSelectedRef] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<TransactionReceipt | null>(null)
  const [receiptLoading, setReceiptLoading] = useState(false)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await paymentsApi.transactions()
        setTransactions(data)
      } catch {
        setError("Failed to load transactions. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchTransactions()
  }, [])

  useEffect(() => {
    if (!selectedRef) {
      setReceipt(null)
      return
    }
    const fetchReceipt = async () => {
      setReceiptLoading(true)
      try {
        const data = await paymentsApi.receipt(selectedRef)
        setReceipt(data)
      } catch {
        setReceipt(null)
      } finally {
        setReceiptLoading(false)
      }
    }
    fetchReceipt()
  }, [selectedRef])

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        !search ||
        tx.reference.toLowerCase().includes(search.toLowerCase()) ||
        tx.channel.toLowerCase().includes(search.toLowerCase()) ||
        (tx.payer_msisdn || "").includes(search)
      const matchesStatus = statusFilter === "ALL" || tx.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [transactions, search, statusFilter])

  const counts = useMemo(() => {
    const c: Record<string, number> = { ALL: transactions.length }
    for (const tx of transactions) {
      c[tx.status] = (c[tx.status] || 0) + 1
    }
    return c
  }, [transactions])

  return (
    <DashboardShell breadcrumb="Transactions">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-sm sm:text-base text-muted-foreground">View and manage all your payment transactions.</p>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="ALL">All ({counts.ALL || 0})</TabsTrigger>
          <TabsTrigger value="SUCCESS">Success ({counts.SUCCESS || 0})</TabsTrigger>
          <TabsTrigger value="PENDING">Pending ({counts.PENDING || 0})</TabsTrigger>
          <TabsTrigger value="PROCESSING" className="hidden sm:inline-flex">Processing ({counts.PROCESSING || 0})</TabsTrigger>
          <TabsTrigger value="FAILED">Failed ({counts.FAILED || 0})</TabsTrigger>
          <TabsTrigger value="REVERSED" className="hidden sm:inline-flex">Reversed ({counts.REVERSED || 0})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[140px] max-w-sm">
          <HugeiconsIcon
            icon={Search01Icon}
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
          />
          <Input
            placeholder="Search by reference, channel, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm">
          <HugeiconsIcon icon={Download04Icon} className="size-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {statusFilter === "ALL" ? "All Transactions" : `${statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()} Transactions`}
            {" "}({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="size-6" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8 text-destructive">
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              No transactions found.
            </div>
          ) : (
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((tx) => (
                  <TableRow
                    key={tx.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedRef(tx.reference)}
                  >
                    <TableCell className="font-mono text-xs">{tx.reference}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`flex size-6 items-center justify-center rounded-full ${tx.type === "COLLECTION" ? "bg-green-500/10" : "bg-destructive/10"}`}>
                          <HugeiconsIcon
                            icon={tx.type === "COLLECTION" ? ArrowDown01Icon : ArrowUp01Icon}
                            className={`size-3 ${tx.type === "COLLECTION" ? "text-green-500" : "text-destructive"}`}
                          />
                        </div>
                        <span className="text-xs">{tx.type === "COLLECTION" ? "Received" : "Sent"}</span>
                      </div>
                    </TableCell>
                    <TableCell>{tx.channel}</TableCell>
                    <TableCell className="font-medium">
                      {tx.currency} {Number(tx.amount).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_COLORS[tx.status] || "outline"}>
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(tx.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Detail Dialog */}
      <Dialog open={!!selectedRef} onOpenChange={(open) => !open && setSelectedRef(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Detailed information about this transaction.
            </DialogDescription>
          </DialogHeader>
          {receiptLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="size-6" />
            </div>
          ) : receipt ? (
            <div className="flex flex-col gap-4">
              {/* Status banner */}
              <div className={`flex items-center gap-3 rounded-lg p-4 ${receipt.status === "SUCCESS" ? "bg-green-500/10" : receipt.status === "PENDING" || receipt.status === "PROCESSING" ? "bg-yellow-500/10" : "bg-destructive/10"}`}>
                <HugeiconsIcon
                  icon={STATUS_ICONS[receipt.status] || Clock01Icon}
                  className={`size-8 ${receipt.status === "SUCCESS" ? "text-green-500" : receipt.status === "PENDING" || receipt.status === "PROCESSING" ? "text-yellow-500" : "text-destructive"}`}
                />
                <div>
                  <p className="font-semibold text-lg">{receipt.status_label || receipt.status}</p>
                  <p className="text-sm text-muted-foreground">{receipt.channel_label || receipt.channel}</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-3xl font-bold">
                  {receipt.currency} {Number(receipt.amount).toLocaleString()}
                </p>
                {receipt.fee_amount && Number(receipt.fee_amount) > 0 && (
                  <div className="flex items-center justify-center gap-4 mt-2 text-sm">
                    <span className="text-muted-foreground">
                      Fee: <span className="font-semibold text-destructive">{receipt.fee_formatted}</span>
                    </span>
                    <span className="text-muted-foreground">
                      Net: <span className="font-semibold text-green-600 dark:text-green-400">{receipt.net_formatted}</span>
                    </span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Reference</p>
                  <p className="font-mono text-xs">{receipt.reference}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p>{receipt.type_label || receipt.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payer Phone</p>
                  <p>{receipt.payer_msisdn || "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p>{receipt.date_formatted || new Date(receipt.created_at).toLocaleString()}</p>
                </div>
                {receipt.selcom_transid && (
                  <div>
                    <p className="text-muted-foreground">Provider Ref</p>
                    <p className="font-mono text-xs">{receipt.selcom_transid}</p>
                  </div>
                )}
                {receipt.failure_reason && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Failure Reason</p>
                    <p className="text-destructive text-xs">{receipt.failure_reason}</p>
                  </div>
                )}
              </div>

              {receipt.status === "SUCCESS" && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const r = receipt
                    const printContent = `
                      <html>
                        <head>
                          <title>Receipt - ${r.reference}</title>
                          <style>
                            * { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
                            body { max-width: 400px; margin: 40px auto; padding: 20px; color: #1a1a1a; }
                            .header { text-align: center; margin-bottom: 30px; }
                            .header img { width: 48px; height: 48px; margin: 0 auto; }
                            .header h1 { font-size: 20px; margin: 10px 0 4px; }
                            .header p { font-size: 12px; color: #666; margin: 0; }
                            .status { text-align: center; padding: 12px; border-radius: 8px; background: #ecfdf5; margin-bottom: 20px; }
                            .status p { margin: 0; font-weight: 600; color: #059669; }
                            .amount { text-align: center; margin: 20px 0; }
                            .amount .label { font-size: 12px; color: #666; }
                            .amount .value { font-size: 32px; font-weight: 800; }
                            .fees { display: flex; justify-content: center; gap: 20px; font-size: 13px; margin-top: 8px; }
                            .fees .fee { color: #dc2626; }
                            .fees .net { color: #059669; font-weight: 600; }
                            .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 13px; }
                            .row .label { color: #666; }
                            .row .value { font-weight: 500; }
                            .footer { text-align: center; margin-top: 30px; font-size: 11px; color: #999; }
                          </style>
                        </head>
                        <body>
                          <div class="header">
                            <img src="${window.location.origin}/salamapaylogo.png" alt="Salamapay" />
                            <h1>Salamapay</h1>
                            <p>Payment Receipt</p>
                          </div>
                          <div class="status">
                            <p>✓ ${r.status_label || r.status}</p>
                          </div>
                          <div class="amount">
                            <div class="label">Amount</div>
                            <div class="value">${r.currency} ${Number(r.amount).toLocaleString()}</div>
                            ${r.fee_amount && Number(r.fee_amount) > 0 ? `
                            <div class="fees">
                              <span class="fee">Fee: ${r.fee_formatted}</span>
                              <span class="net">Net: ${r.net_formatted}</span>
                            </div>` : ''}
                          </div>
                          <div class="row"><span class="label">Reference</span><span class="value" style="font-family:monospace;font-size:11px">${r.reference}</span></div>
                          <div class="row"><span class="label">Type</span><span class="value">${r.type_label || r.type}</span></div>
                          <div class="row"><span class="label">Channel</span><span class="value">${r.channel_label || r.channel}</span></div>
                          <div class="row"><span class="label">Payer Phone</span><span class="value">${r.payer_msisdn || 'N/A'}</span></div>
                          <div class="row"><span class="label">Date</span><span class="value">${r.date_formatted || new Date(r.created_at).toLocaleString()}</span></div>
                          ${r.selcom_transid ? `<div class="row"><span class="label">Provider Ref</span><span class="value" style="font-family:monospace;font-size:11px">${r.selcom_transid}</span></div>` : ''}
                          <div class="footer">
                            <p>This is a computer-generated receipt from Salamapay.</p>
                            <p>© ${new Date().getFullYear()} Salamapay Payments. All rights reserved.</p>
                          </div>
                        </body>
                      </html>
                    `
                    const printWin = window.open('', '_blank', 'width=500,height=700')
                    if (printWin) {
                      printWin.document.write(printContent)
                      printWin.document.close()
                      printWin.focus()
                      setTimeout(() => printWin.print(), 500)
                    }
                  }}
                >
                  <HugeiconsIcon icon={Download01Icon} className="size-4" />
                  Download Receipt (PDF)
                </Button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              Failed to load transaction details.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
