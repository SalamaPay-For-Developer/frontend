"use client"

import { useState, useEffect, useMemo } from "react"
import { DeveloperShell } from "@/components/developer-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Separator } from "@/components/ui/separator"
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
  DialogFooter,
} from "@/components/ui/dialog"
import { paymentsApi } from "@/lib/api"
import type { Transaction } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowUp01Icon,
  Search01Icon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons"

const STATUS_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  SUCCESS: "default",
  PENDING: "secondary",
  PROCESSING: "secondary",
  FAILED: "destructive",
  REVERSED: "outline",
}

export default function DeveloperRefundsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showRefund, setShowRefund] = useState(false)
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [refundAmount, setRefundAmount] = useState("")
  const [refundReason, setRefundReason] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await paymentsApi.transactions()
        setTransactions(data)
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const refundable = useMemo(() => {
    return transactions.filter((t) => t.type === "COLLECTION" && t.status === "SUCCESS")
  }, [transactions])

  const refunded = useMemo(() => {
    return transactions.filter((t) => t.status === "REVERSED")
  }, [transactions])

  const filtered = useMemo(() => {
    if (!search) return refundable
    return refundable.filter((t) =>
      t.reference.toLowerCase().includes(search.toLowerCase()) ||
      t.channel.toLowerCase().includes(search.toLowerCase()) ||
      (t.payer_msisdn || "").includes(search)
    )
  }, [refundable, search])

  const openRefundDialog = (tx: Transaction) => {
    setSelectedTx(tx)
    setRefundAmount(tx.amount)
    setRefundReason("")
    setError("")
    setShowRefund(true)
  }

  const handleRefund = async () => {
    if (!selectedTx || !refundAmount) {
      setError("Refund amount is required")
      return
    }
    setSubmitting(true)
    setError("")
    try {
      // In production, this would call a refund endpoint
      // For now, we simulate by updating the transaction status
      setTransactions(transactions.map((t) =>
        t.id === selectedTx.id ? { ...t, status: "REVERSED" as const } : t
      ))
      setShowRefund(false)
      setSuccess(`Refund of TZS ${Number(refundAmount).toLocaleString()} initiated for ${selectedTx.reference}`)
    } catch {
      setError("Failed to process refund. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const totalRefundable = refundable.reduce((sum, t) => sum + Number(t.amount), 0)
  const totalRefunded = refunded.reduce((sum, t) => sum + Number(t.amount), 0)

  return (
    <DeveloperShell breadcrumb="Refunds">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Refunds</h1>
        <p className="text-sm text-muted-foreground">Process and track refunds for successful collections.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Refundable Amount</p>
            <p className="text-xl font-bold">TZS {totalRefundable.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Refunded</p>
            <p className="text-xl font-bold">TZS {totalRefunded.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Refundable Transactions</p>
            <p className="text-xl font-bold">{refundable.length}</p>
          </CardContent>
        </Card>
      </div>

      {success && (
        <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
          <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" />
          {success}
        </div>
      )}

      {/* Refundable Transactions */}
      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Refundable Transactions
            <div className="relative w-48">
              <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 pl-8 text-xs" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8"><Spinner className="size-6" /></div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <HugeiconsIcon icon={ArrowUp01Icon} className="size-12 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">No refundable transactions.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Payer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-mono text-xs">{tx.reference}</TableCell>
                    <TableCell className="text-xs">{tx.channel}</TableCell>
                    <TableCell className="text-xs">{tx.payer_msisdn || "—"}</TableCell>
                    <TableCell className="font-medium text-xs">{tx.currency} {Number(tx.amount).toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{new Date(tx.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => openRefundDialog(tx)}>
                        <HugeiconsIcon icon={ArrowUp01Icon} className="size-3" />
                        Refund
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Refund History */}
      {refunded.length > 0 && (
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardHeader><CardTitle className="text-sm">Refund History</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {refunded.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-mono text-xs">{tx.reference}</TableCell>
                    <TableCell className="text-xs">{tx.channel}</TableCell>
                    <TableCell className="font-medium text-xs">{tx.currency} {Number(tx.amount).toLocaleString()}</TableCell>
                    <TableCell><Badge variant="outline">REFUNDED</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-xs">{new Date(tx.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Refund Dialog */}
      <Dialog open={showRefund} onOpenChange={setShowRefund}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
            <DialogDescription>Refund a successful collection. The amount will be returned to the customer.</DialogDescription>
          </DialogHeader>
          {selectedTx && (
            <div className="flex flex-col gap-4">
              <div className="rounded-lg bg-muted/30 p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference</span>
                  <span className="font-mono text-xs">{selectedTx.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Channel</span>
                  <span>{selectedTx.channel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payer</span>
                  <span>{selectedTx.payer_msisdn || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Original Amount</span>
                  <span className="font-bold">{selectedTx.currency} {Number(selectedTx.amount).toLocaleString()}</span>
                </div>
              </div>
              <Separator />
              <div className="flex flex-col gap-2">
                <Label>Refund Amount (TZS)</Label>
                <Input type="number" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} />
                <p className="text-xs text-muted-foreground">Max: TZS {Number(selectedTx.amount).toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Reason (optional)</Label>
                <Input placeholder="Customer request" value={refundReason} onChange={(e) => setRefundReason(e.target.value)} />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefund(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRefund} disabled={submitting}>
              {submitting ? <Spinner className="size-4" /> : <HugeiconsIcon icon={ArrowUp01Icon} className="size-4" />}
              Process Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DeveloperShell>
  )
}
