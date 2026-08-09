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
import { Switch } from "@/components/ui/switch"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { adminApi } from "@/lib/api"
import type { StaffProfile, Role, Department, Branch } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Cancel01Icon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons"

const STATUS_BADGE: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  ACTIVE: "default",
  INACTIVE: "secondary",
  SUSPENDED: "destructive",
  INVITED: "outline",
}

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffProfile[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    phone_number: "", full_name: "", email: "",
    role: "", department: "", branch: "",
    can_access_all_branches: false, employee_id: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, r, d, b] = await Promise.all([
          adminApi.staff(),
          adminApi.roles(),
          adminApi.departments(),
          adminApi.branches(),
        ])
        setStaff(s)
        setRoles(r)
        setDepartments(d)
        setBranches(b)
      } catch { /* ignore */ } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleCreate = async () => {
    if (!form.phone_number || !form.full_name || !form.role) {
      setError("Phone, name, and role are required")
      return
    }
    setSubmitting(true)
    setError("")
    try {
      const data: Record<string, unknown> = {
        phone_number: form.phone_number,
        full_name: form.full_name,
        role: form.role,
        can_access_all_branches: form.can_access_all_branches,
      }
      if (form.email) data.email = form.email
      if (form.department) data.department = form.department
      if (form.branch) data.branch = form.branch
      if (form.employee_id) data.employee_id = form.employee_id

      const profile = await adminApi.createStaff(data as Parameters<typeof adminApi.createStaff>[0])
      setStaff([profile, ...staff])
      setShowCreate(false)
      setForm({ phone_number: "", full_name: "", email: "", role: "", department: "", branch: "", can_access_all_branches: false, employee_id: "" })
    } catch {
      setError("Failed to create staff member")
    } finally {
      setSubmitting(false)
    }
  }

  const handleSuspend = async (id: string) => {
    try {
      await adminApi.suspendStaff(id)
      setStaff(staff.map((s) => s.id === id ? { ...s, status: "SUSPENDED" } : s))
    } catch { /* ignore */ }
  }

  const handleActivate = async (id: string) => {
    try {
      await adminApi.activateStaff(id)
      setStaff(staff.map((s) => s.id === id ? { ...s, status: "ACTIVE" } : s))
    } catch { /* ignore */ }
  }

  return (
    <AdminShell breadcrumb="Staff">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">Manage SalamaPay staff, roles, and permissions.</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          Add Staff
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
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.user_name}</TableCell>
                    <TableCell className="font-mono text-sm">{s.user_phone}</TableCell>
                    <TableCell><Badge variant="outline">{s.role_name}</Badge></TableCell>
                    <TableCell className="text-sm">{s.department_name || "—"}</TableCell>
                    <TableCell className="text-sm">{s.branch_name || "—"}</TableCell>
                    <TableCell><Badge variant={STATUS_BADGE[s.status] || "outline"}>{s.status}</Badge></TableCell>
                    <TableCell>
                      {s.status === "ACTIVE" ? (
                        <Button size="sm" variant="ghost" onClick={() => handleSuspend(s.id)}>Suspend</Button>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => handleActivate(s.id)}>Activate</Button>
                      )}
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
          <DialogHeader><DialogTitle>Add Staff Member</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Full Name</Label>
                <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Phone Number</Label>
                <Input value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} placeholder="2557XXXXXXXX" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Email (Optional)</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v || "" })}>
                <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>
                  {roles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Department</Label>
                <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v || "" })}>
                  <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Branch</Label>
                <Select value={form.branch} onValueChange={(v) => setForm({ ...form, branch: v || "" })}>
                  <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Access All Branches</Label>
              <Switch checked={form.can_access_all_branches} onCheckedChange={(v) => setForm({ ...form, can_access_all_branches: v })} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Employee ID (Optional)</Label>
              <Input value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={submitting}>
                {submitting ? <Spinner className="size-4" /> : <HugeiconsIcon icon={PlusSignIcon} className="size-4" />}
                Create
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </AdminShell>
  )
}
