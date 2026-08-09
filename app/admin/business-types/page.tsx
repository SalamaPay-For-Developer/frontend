"use client"

import { useState, useEffect } from "react"
import { AdminShell } from "@/components/admin-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { adminApi } from "@/lib/api"
import type { BusinessTypeConfig } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon } from "@hugeicons/core-free-icons"

export default function AdminBusinessTypesPage() {
  const [types, setTypes] = useState<BusinessTypeConfig[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: "", code: "", default_fee_percentage: "1.5",
    requires_tin: true, requires_license: true, requires_national_id: true,
    requires_bank_account: true, requires_brela: false, requires_selfie: false,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setTypes(await adminApi.businessTypes())
      } catch { /* ignore */ } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleCreate = async () => {
    if (!form.name || !form.code) return
    setSubmitting(true)
    try {
      const t = await adminApi.createBusinessType(form)
      setTypes([t, ...types])
      setShowCreate(false)
      setForm({ name: "", code: "", default_fee_percentage: "1.5", requires_tin: true, requires_license: true, requires_national_id: true, requires_bank_account: true, requires_brela: false, requires_selfie: false })
    } catch { /* ignore */ } finally {
      setSubmitting(false)
    }
  }

  const toggleActive = async (t: BusinessTypeConfig) => {
    try {
      const updated = await adminApi.updateBusinessType(t.id, { is_active: !t.is_active })
      setTypes(types.map((x) => x.id === updated.id ? updated : x))
    } catch { /* ignore */ }
  }

  if (isLoading) {
    return (
      <AdminShell breadcrumb="Business Types">
        <div className="flex items-center justify-center py-12"><Spinner className="size-8" /></div>
      </AdminShell>
    )
  }

  return (
    <AdminShell breadcrumb="Business Types">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Business Types</h1>
          <p className="text-muted-foreground">Configure business categories and KYC requirements.</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          Add Type
        </Button>
      </div>

      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Default Fee</TableHead>
                <TableHead>Requirements</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {types.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="font-mono text-sm">{t.code}</TableCell>
                  <TableCell>{t.default_fee_percentage}%</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {t.requires_tin && <Badge variant="outline" className="text-xs">TIN</Badge>}
                      {t.requires_license && <Badge variant="outline" className="text-xs">License</Badge>}
                      {t.requires_national_id && <Badge variant="outline" className="text-xs">ID</Badge>}
                      {t.requires_bank_account && <Badge variant="outline" className="text-xs">Bank</Badge>}
                      {t.requires_brela && <Badge variant="outline" className="text-xs">BRELA</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={t.is_active ? "default" : "secondary"}>
                      {t.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => toggleActive(t)}>
                      {t.is_active ? "Disable" : "Enable"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add Business Type</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Restaurant" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Code</Label>
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="RESTAURANT" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Default Fee Percentage</Label>
              <Input type="number" value={form.default_fee_percentage} onChange={(e) => setForm({ ...form, default_fee_percentage: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "requires_tin", label: "TIN" },
                { key: "requires_license", label: "License" },
                { key: "requires_national_id", label: "National ID" },
                { key: "requires_bank_account", label: "Bank Account" },
                { key: "requires_brela", label: "BRELA" },
                { key: "requires_selfie", label: "Selfie" },
              ].map((req) => (
                <div key={req.key} className="flex items-center justify-between">
                  <Label>{req.label}</Label>
                  <Switch
                    checked={form[req.key as keyof typeof form] as boolean}
                    onCheckedChange={(v) => setForm({ ...form, [req.key]: v })}
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={submitting}>Create</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </AdminShell>
  )
}
