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
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">View and manage all your payment transactions.</p>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="ALL">All ({counts.ALL || 0})</TabsTrigger>
          <TabsTrigger value="SUCCESS">Successful ({counts.SUCCESS || 0})</TabsTrigger>
          <TabsTrigger value="PENDING">Pending ({counts.PENDING || 0})</TabsTrigger>
          <TabsTrigger value="PROCESSING">Processing ({counts.PROCESSING || 0})</TabsTrigger>
          <TabsTrigger value="FAILED">Failed ({counts.FAILED || 0})</TabsTrigger>
          <TabsTrigger value="REVERSED">Reversed ({counts.REVERSED || 0})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
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
