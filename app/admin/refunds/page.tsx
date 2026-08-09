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
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { adminApi } from "@/lib/api"
import type { Refund } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"

const STATUS_BADGE: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  REQUESTED: "secondary",
  APPROVED: "default",
  PROCESSING: "secondary",
  COMPLETED: "default",
  REJECTED: "destructive",
}

export default function AdminRefundsPage() {
  const [refunds, setRefunds] = useState<Refund[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showReject, setShowReject] = useState(false)
  const [rejectTarget, setRejectTarget] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  useEffect(() => { fetchRefunds() }, [])

  const fetchRefunds = async () => {
    setIsLoading(true)
    try {
      const data = await adminApi.refunds()
      setRefunds(data)
    } catch { /* ignore */ } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      await adminApi.approveRefund(id)
      setRefunds(refunds.map((r) => r.id === id ? { ...r, status: "APPROVED" } : r))
    } catch { /* ignore */ }
  }

  const handleReject = async () => {
    if (!rejectTarget) return
    try {
      await adminApi.rejectRefund(rejectTarget, rejectReason)
      setRefunds(refunds.map((r) => r.id === rejectTarget ? { ...r, status: "REJECTED" } : r))
      setShowReject(false)
      setRejectReason("")
      setRejectTarget(null)
    } catch { /* ignore */ }
  }

  return (
    <AdminShell breadcrumb="Refunds">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Refunds & Disputes</h1>
        <p className="text-muted-foreground">Review and process refund requests.</p>
      </div>

      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8"><Spinner className="size-6" /></div>
          ) : refunds.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">No refunds yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {refunds.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-sm">{r.transaction_ref}</TableCell>
                    <TableCell className="text-sm">{r.business_name || "—"}</TableCell>
                    <TableCell>TZS {Number(r.amount).toLocaleString()}</TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">{r.reason}</TableCell>
                    <TableCell className="text-sm">{r.requested_by_name || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_BADGE[r.status] || "outline"}>{r.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {r.status === "REQUESTED" && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => handleApprove(r.id)}>
                            <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4 text-green-500" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => { setRejectTarget(r.id); setShowReject(true) }}>
                            <HugeiconsIcon icon={Cancel01Icon} className="size-4 text-destructive" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showReject} onOpenChange={setShowReject}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Reject Refund</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="reject-reason">Reason</Label>
              <textarea
                id="reject-reason"
                className="rounded-lg border bg-background p-3 min-h-[100px] resize-y text-sm"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowReject(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleReject} disabled={!rejectReason}>Reject</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </AdminShell>
  )
}
