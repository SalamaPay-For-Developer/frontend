"use client"

import { useState, useEffect } from "react"
import { AdminShell } from "@/components/admin-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Separator } from "@/components/ui/separator"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { adminApi } from "@/lib/api"
import type { AdminBusiness } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon, CheckmarkCircle01Icon, Cancel01Icon, Store04Icon,
} from "@hugeicons/core-free-icons"

const KYC_BADGE: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  APPROVED: "default",
  PENDING: "secondary",
  REJECTED: "destructive",
  DRAFT: "outline",
  UNDER_REVIEW: "secondary",
}

export default function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState<AdminBusiness[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [kycFilter, setKycFilter] = useState("ALL")
  const [selected, setSelected] = useState<AdminBusiness | null>(null)
  const [showReject, setShowReject] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchBusinesses()
  }, [])

  const fetchBusinesses = async () => {
    setIsLoading(true)
    try {
      const params: Record<string, string> = {}
      if (search) params.search = search
      if (kycFilter !== "ALL") params.kyc_status = kycFilter
      const data = await adminApi.businesses(params)
      setBusinesses(data)
    } catch { /* ignore */ } finally {
      setIsLoading(false)
    }
  }

  const handleApproveKyc = async (id: string) => {
    setActionLoading(true)
    try {
      await adminApi.approveKyc(id)
      setBusinesses(businesses.map((b) => b.id === id ? { ...b, kyc_status: "APPROVED", kyc_status_display: "Approved" } : b))
      if (selected?.id === id) setSelected({ ...selected, kyc_status: "APPROVED", kyc_status_display: "Approved" })
    } catch { /* ignore */ } finally {
      setActionLoading(false)
    }
  }

  const handleRejectKyc = async () => {
    if (!selected) return
    setActionLoading(true)
    try {
      await adminApi.rejectKyc(selected.id, rejectReason)
      setBusinesses(businesses.map((b) => b.id === selected.id ? { ...b, kyc_status: "REJECTED", kyc_status_display: "Rejected" } : b))
      setShowReject(false)
      setRejectReason("")
    } catch { /* ignore */ } finally {
      setActionLoading(false)
    }
  }

  const handleSuspend = async (id: string) => {
    try {
      await adminApi.suspendBusiness(id)
      setBusinesses(businesses.map((b) => b.id === id ? { ...b, is_active: false } : b))
    } catch { /* ignore */ }
  }

  const handleReactivate = async (id: string) => {
    try {
      await adminApi.reactivateBusiness(id)
      setBusinesses(businesses.map((b) => b.id === id ? { ...b, is_active: true } : b))
    } catch { /* ignore */ }
  }

  return (
    <AdminShell breadcrumb="Businesses">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Business Management</h1>
        <p className="text-muted-foreground">Approve KYC, suspend, and manage all businesses.</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by business name, owner, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchBusinesses()}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((s) => (
            <Button key={s} variant={kycFilter === s ? "default" : "outline"} size="sm"
              onClick={() => { setKycFilter(s); setTimeout(fetchBusinesses, 0) }}>
              {s}
            </Button>
          ))}
        </div>
        <Button onClick={fetchBusinesses}>Search</Button>
      </div>

      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8"><Spinner className="size-6" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>KYC</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.slice(0, 50).map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.business_name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{b.owner_name}</span>
                        <span className="text-xs text-muted-foreground">{b.owner_phone}</span>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{b.business_type}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={KYC_BADGE[b.kyc_status] || "outline"}>{b.kyc_status_display}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={b.is_active ? "default" : "destructive"}>
                        {b.is_active ? "Active" : "Suspended"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{b.transactions_count}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => setSelected(b)}>View</Button>
                        {b.kyc_status === "PENDING" && (
                          <Button size="sm" variant="ghost" onClick={() => handleApproveKyc(b.id)}>Approve</Button>
                        )}
                        {b.is_active ? (
                          <Button size="sm" variant="ghost" onClick={() => handleSuspend(b.id)}>Suspend</Button>
                        ) : (
                          <Button size="sm" variant="ghost" onClick={() => handleReactivate(b.id)}>Reactivate</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Business Detail */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Business Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                  <HugeiconsIcon icon={Store04Icon} className="size-6" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{selected.business_name}</p>
                  <p className="text-sm text-muted-foreground">{selected.business_type}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Owner: </span>{selected.owner_name}</div>
                <div><span className="text-muted-foreground">Phone: </span>{selected.owner_phone}</div>
                <div><span className="text-muted-foreground">TIN: </span>{selected.tin || "—"}</div>
                <div><span className="text-muted-foreground">BRELA: </span>{selected.brela_number || "—"}</div>
                <div><span className="text-muted-foreground">License: </span>{selected.business_license || "—"}</div>
                <div><span className="text-muted-foreground">Vendor ID: </span>{selected.selcom_vendor_id || "—"}</div>
                <div><span className="text-muted-foreground">KYC: </span>
                  <Badge variant={KYC_BADGE[selected.kyc_status] || "outline"}>{selected.kyc_status_display}</Badge>
                </div>
                <div><span className="text-muted-foreground">Status: </span>
                  <Badge variant={selected.is_active ? "default" : "destructive"}>
                    {selected.is_active ? "Active" : "Suspended"}
                  </Badge>
                </div>
              </div>

              {selected.description && (
                <div>
                  <p className="text-sm font-medium mb-1">Description</p>
                  <p className="text-sm text-muted-foreground">{selected.description}</p>
                </div>
              )}

              {selected.kyc && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-2">KYC Information</p>
                    <pre className="text-xs font-mono bg-muted p-3 rounded overflow-auto max-h-40">
                      {JSON.stringify(selected.kyc, null, 2)}
                    </pre>
                  </div>
                </>
              )}

              <Separator />
              <div className="flex gap-2">
                {selected.kyc_status === "PENDING" && (
                  <>
                    <Button onClick={() => handleApproveKyc(selected.id)} disabled={actionLoading}>
                      <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" />
                      Approve KYC
                    </Button>
                    <Button variant="destructive" onClick={() => setShowReject(true)}>
                      <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
                      Reject KYC
                    </Button>
                  </>
                )}
                {selected.is_active ? (
                  <Button variant="outline" onClick={() => handleSuspend(selected.id)}>Suspend</Button>
                ) : (
                  <Button variant="outline" onClick={() => handleReactivate(selected.id)}>Reactivate</Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showReject} onOpenChange={setShowReject}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Reject KYC</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="reject-reason">Reason for rejection</Label>
              <textarea
                id="reject-reason"
                className="rounded-lg border bg-background p-3 min-h-[100px] resize-y text-sm"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Please provide a reason..."
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowReject(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleRejectKyc} disabled={actionLoading || !rejectReason}>
                Reject
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </AdminShell>
  )
}
