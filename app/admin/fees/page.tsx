"use client"

import { useState, useEffect } from "react"
import { AdminShell } from "@/components/admin-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { adminApi } from "@/lib/api"
import type { FeeConfig, SettlementFee, CommissionRule } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, PercentIcon } from "@hugeicons/core-free-icons"

export default function AdminFeesPage() {
  const [fees, setFees] = useState<FeeConfig[]>([])
  const [settlementFees, setSettlementFees] = useState<SettlementFee[]>([])
  const [commissions, setCommissions] = useState<CommissionRule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [tab, setTab] = useState<"transaction" | "settlement" | "commission">("transaction")
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    name: "", channel: "MOBILE_MONEY", fee_type: "PERCENTAGE",
    percentage: "1.5", fixed_fee: "0", min_fee: "0", max_fee: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [f, sf, c] = await Promise.all([
          adminApi.fees(),
          adminApi.settlementFees(),
          adminApi.commissions(),
        ])
        setFees(f)
        setSettlementFees(sf)
        setCommissions(c)
      } catch { /* ignore */ } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleCreate = async () => {
    setSubmitting(true)
    try {
      const data: Record<string, unknown> = {
        name: form.name,
        channel: form.channel,
        fee_type: form.fee_type,
        percentage: form.percentage,
        fixed_fee: form.fixed_fee,
        min_fee: form.min_fee,
      }
      if (form.max_fee) data.max_fee = form.max_fee
      const fee = await adminApi.createFee(data as Partial<FeeConfig>)
      setFees([fee, ...fees])
      setShowCreate(false)
      setForm({ name: "", channel: "MOBILE_MONEY", fee_type: "PERCENTAGE", percentage: "1.5", fixed_fee: "0", min_fee: "0", max_fee: "" })
    } catch { /* ignore */ } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <AdminShell breadcrumb="Fees">
        <div className="flex items-center justify-center py-12"><Spinner className="size-8" /></div>
      </AdminShell>
    )
  }

  return (
    <AdminShell breadcrumb="Fees">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Fee Management</h1>
          <p className="text-muted-foreground">Configure transaction fees, settlement fees, and commissions.</p>
        </div>
        {tab === "transaction" && (
          <Button onClick={() => setShowCreate(true)}>
            <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
            Add Fee
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        {[
          { key: "transaction", label: "Transaction Fees" },
          { key: "settlement", label: "Settlement Fees" },
          { key: "commission", label: "Commissions" },
        ].map((t) => (
          <Button key={t.key} variant={tab === t.key ? "default" : "outline"} size="sm"
            onClick={() => setTab(t.key as typeof tab)}>
            {t.label}
          </Button>
        ))}
      </div>

      {tab === "transaction" && (
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Fixed</TableHead>
                  <TableHead>Min/Max</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fees.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium">{f.name}</TableCell>
                    <TableCell><Badge variant="outline">{f.channel}</Badge></TableCell>
                    <TableCell><Badge variant="secondary">{f.fee_type}</Badge></TableCell>
                    <TableCell>{f.percentage}%</TableCell>
                    <TableCell>TZS {Number(f.fixed_fee).toLocaleString()}</TableCell>
                    <TableCell className="text-sm">
                      {Number(f.min_fee).toLocaleString()} / {f.max_fee ? Number(f.max_fee).toLocaleString() : "∞"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={f.is_active ? "default" : "secondary"}>
                        {f.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {tab === "settlement" && (
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Fixed</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settlementFees.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium">{f.name}</TableCell>
                    <TableCell><Badge variant="secondary">{f.fee_type}</Badge></TableCell>
                    <TableCell>TZS {Number(f.fixed_fee).toLocaleString()}</TableCell>
                    <TableCell>{f.percentage}%</TableCell>
                    <TableCell>
                      <Badge variant={f.is_active ? "default" : "secondary"}>
                        {f.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {tab === "commission" && (
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Calculation</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Fixed</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissions.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell><Badge variant="outline">{c.commission_type}</Badge></TableCell>
                    <TableCell><Badge variant="secondary">{c.calculation_type}</Badge></TableCell>
                    <TableCell>{c.percentage}%</TableCell>
                    <TableCell>TZS {Number(c.fixed_amount).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={c.is_active ? "default" : "secondary"}>
                        {c.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Create Fee</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Mobile Money Fee" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Channel</Label>
              <Select value={form.channel} onValueChange={(v) => setForm({ ...form, channel: v || "MOBILE_MONEY" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                  <SelectItem value="CARD">Card</SelectItem>
                  <SelectItem value="BANK">Bank</SelectItem>
                  <SelectItem value="QR">QR</SelectItem>
                  <SelectItem value="UTILITY">Utility</SelectItem>
                  <SelectItem value="GOVERNMENT">Government</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Fee Type</Label>
              <Select value={form.fee_type} onValueChange={(v) => setForm({ ...form, fee_type: v || "PERCENTAGE" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                  <SelectItem value="FIXED">Fixed</SelectItem>
                  <SelectItem value="TIERED">Tiered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Percentage</Label>
                <Input type="number" value={form.percentage} onChange={(e) => setForm({ ...form, percentage: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Fixed Fee</Label>
                <Input type="number" value={form.fixed_fee} onChange={(e) => setForm({ ...form, fixed_fee: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Min Fee</Label>
                <Input type="number" value={form.min_fee} onChange={(e) => setForm({ ...form, min_fee: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Max Fee (Optional)</Label>
                <Input type="number" value={form.max_fee} onChange={(e) => setForm({ ...form, max_fee: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={submitting || !form.name}>
                {submitting ? <Spinner className="size-4" /> : <HugeiconsIcon icon={PercentIcon} className="size-4" />}
                Create
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </AdminShell>
  )
}
