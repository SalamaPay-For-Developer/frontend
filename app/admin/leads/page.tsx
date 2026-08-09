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
import type { SalesLead } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon } from "@hugeicons/core-free-icons"

const STAGE_BADGE: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  LEAD: "outline",
  CONTACTED: "secondary",
  INTERESTED: "secondary",
  KYC_STARTED: "secondary",
  KYC_SUBMITTED: "secondary",
  APPROVED: "default",
  ACTIVATED: "default",
  LOST: "destructive",
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<SalesLead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [stageFilter, setStageFilter] = useState("ALL")
  const [form, setForm] = useState({
    business_name: "", contact_name: "", contact_phone: "",
    contact_email: "", business_type: "", stage: "LEAD", priority: "MEDIUM",
  })

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    setIsLoading(true)
    try {
      const params: Record<string, string> = {}
      if (stageFilter !== "ALL") params.stage = stageFilter
      setLeads(await adminApi.leads(params))
    } catch { /* ignore */ } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!form.business_name) return
    setSubmitting(true)
    try {
      const lead = await adminApi.createLead(form)
      setLeads([lead, ...leads])
      setShowCreate(false)
      setForm({ business_name: "", contact_name: "", contact_phone: "", contact_email: "", business_type: "", stage: "LEAD", priority: "MEDIUM" })
    } catch { /* ignore */ } finally {
      setSubmitting(false)
    }
  }

  const updateStage = async (id: string, stage: string) => {
    try {
      const updated = await adminApi.updateLead(id, { stage })
      setLeads(leads.map((l) => l.id === updated.id ? updated : l))
    } catch { /* ignore */ }
  }

  return (
    <AdminShell breadcrumb="Leads">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Sales CRM</h1>
          <p className="text-muted-foreground">Track leads through the sales pipeline.</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          Add Lead
        </Button>
      </div>

      <div className="flex gap-2">
        {["ALL", "LEAD", "CONTACTED", "INTERESTED", "KYC_STARTED", "APPROVED", "ACTIVATED"].map((s) => (
          <Button key={s} variant={stageFilter === s ? "default" : "outline"} size="sm"
            onClick={() => { setStageFilter(s); setTimeout(fetchLeads, 0) }}>
            {s.replace(/_/g, " ")}
          </Button>
        ))}
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
                  <TableHead>Contact</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.business_name}</TableCell>
                    <TableCell className="text-sm">{l.contact_name || "—"}</TableCell>
                    <TableCell className="text-sm">{l.contact_phone || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={STAGE_BADGE[l.stage] || "outline"}>{l.stage.replace(/_/g, " ")}</Badge>
                    </TableCell>
                    <TableCell><Badge variant="outline">{l.priority}</Badge></TableCell>
                    <TableCell className="text-sm">{l.assigned_to_name || "—"}</TableCell>
                    <TableCell>
                      <Select onValueChange={(v: string | null) => v && updateStage(l.id, v)}>
                        <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Move" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LEAD">Lead</SelectItem>
                          <SelectItem value="CONTACTED">Contacted</SelectItem>
                          <SelectItem value="INTERESTED">Interested</SelectItem>
                          <SelectItem value="KYC_STARTED">KYC Started</SelectItem>
                          <SelectItem value="KYC_SUBMITTED">KYC Submitted</SelectItem>
                          <SelectItem value="APPROVED">Approved</SelectItem>
                          <SelectItem value="ACTIVATED">Activated</SelectItem>
                          <SelectItem value="LOST">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Lead</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Business Name</Label>
              <Input value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Contact Name</Label>
                <Input value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Phone</Label>
                <Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v || "MEDIUM" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Stage</Label>
                <Select value={form.stage} onValueChange={(v) => setForm({ ...form, stage: v || "LEAD" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LEAD">Lead</SelectItem>
                    <SelectItem value="CONTACTED">Contacted</SelectItem>
                    <SelectItem value="INTERESTED">Interested</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
