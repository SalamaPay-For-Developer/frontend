"use client"

import { useState, useEffect } from "react"
import { AdminShell } from "@/components/admin-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { adminApi } from "@/lib/api"
import type { Biller } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon } from "@hugeicons/core-free-icons"

export default function AdminBillersPage() {
  const [billers, setBillers] = useState<Biller[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: "", code: "", category: "ELECTRICITY", utility_code: "", description: "" })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setBillers(await adminApi.billers())
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
      const biller = await adminApi.createBiller(form)
      setBillers([biller, ...billers])
      setShowCreate(false)
      setForm({ name: "", code: "", category: "ELECTRICITY", utility_code: "", description: "" })
    } catch { /* ignore */ } finally {
      setSubmitting(false)
    }
  }

  const toggleActive = async (b: Biller) => {
    try {
      const updated = await adminApi.updateBiller(b.id, { is_active: !b.is_active })
      setBillers(billers.map((x) => x.id === updated.id ? updated : x))
    } catch { /* ignore */ }
  }

  if (isLoading) {
    return (
      <AdminShell breadcrumb="Billers">
        <div className="flex items-center justify-center py-12"><Spinner className="size-8" /></div>
      </AdminShell>
    )
  }

  return (
    <AdminShell breadcrumb="Billers">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Billers</h1>
          <p className="text-muted-foreground">Manage utility and government billers.</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          Add Biller
        </Button>
      </div>

      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Utility Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billers.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.name}</TableCell>
                  <TableCell className="font-mono text-sm">{b.code}</TableCell>
                  <TableCell><Badge variant="outline">{b.category}</Badge></TableCell>
                  <TableCell className="text-sm">{b.utility_code || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={b.is_active ? "default" : "secondary"}>
                      {b.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => toggleActive(b)}>
                      {b.is_active ? "Disable" : "Enable"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Biller</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Code</Label>
              <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="TANESCO" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v || "ELECTRICITY" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ELECTRICITY">Electricity</SelectItem>
                  <SelectItem value="WATER">Water</SelectItem>
                  <SelectItem value="TV">TV / DTH</SelectItem>
                  <SelectItem value="INTERNET">Internet</SelectItem>
                  <SelectItem value="GOVERNMENT">Government</SelectItem>
                  <SelectItem value="TELECOM">Telecom</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Utility Code (Optional)</Label>
              <Input value={form.utility_code} onChange={(e) => setForm({ ...form, utility_code: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Description (Optional)</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
