"use client"

import { useState, useEffect } from "react"
import { AdminShell } from "@/components/admin-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { adminApi } from "@/lib/api"
import type { Department, Branch } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Building04Icon, Store04Icon } from "@hugeicons/core-free-icons"

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateDept, setShowCreateDept] = useState(false)
  const [showCreateBranch, setShowCreateBranch] = useState(false)
  const [deptForm, setDeptForm] = useState({ name: "", description: "" })
  const [branchForm, setBranchForm] = useState({ name: "", address: "", phone: "" })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [d, b] = await Promise.all([adminApi.departments(), adminApi.branches()])
        setDepartments(d)
        setBranches(b)
      } catch { /* ignore */ } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleCreateDept = async () => {
    if (!deptForm.name) return
    setSubmitting(true)
    try {
      const dept = await adminApi.createDepartment(deptForm)
      setDepartments([dept, ...departments])
      setShowCreateDept(false)
      setDeptForm({ name: "", description: "" })
    } catch { /* ignore */ } finally {
      setSubmitting(false)
    }
  }

  const handleCreateBranch = async () => {
    if (!branchForm.name) return
    setSubmitting(true)
    try {
      const branch = await adminApi.createBranch(branchForm)
      setBranches([branch, ...branches])
      setShowCreateBranch(false)
      setBranchForm({ name: "", address: "", phone: "" })
    } catch { /* ignore */ } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <AdminShell breadcrumb="Departments">
        <div className="flex items-center justify-center py-12"><Spinner className="size-8" /></div>
      </AdminShell>
    )
  }

  return (
    <AdminShell breadcrumb="Departments">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Departments & Branches</h1>
        <p className="text-muted-foreground">Manage organizational structure.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Departments */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Departments</h2>
            <Button size="sm" onClick={() => setShowCreateDept(true)}>
              <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
              Add
            </Button>
          </div>
          <Card className="border-none shadow-sm dark:bg-muted/50">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Staff</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell className="text-sm">{d.staff_count}</TableCell>
                      <TableCell>
                        <Badge variant={d.is_active ? "default" : "secondary"}>
                          {d.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Branches */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Branches</h2>
            <Button size="sm" onClick={() => setShowCreateBranch(true)}>
              <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
              Add
            </Button>
          </div>
          <Card className="border-none shadow-sm dark:bg-muted/50">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Staff</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branches.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.name}</TableCell>
                      <TableCell className="text-sm">{b.phone || "—"}</TableCell>
                      <TableCell className="text-sm">{b.staff_count}</TableCell>
                      <TableCell>
                        <Badge variant={b.is_active ? "default" : "secondary"}>
                          {b.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showCreateDept} onOpenChange={setShowCreateDept}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Create Department</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Name</Label>
              <Input value={deptForm.name} onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Description</Label>
              <Input value={deptForm.description} onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDept(false)}>Cancel</Button>
              <Button onClick={handleCreateDept} disabled={submitting}>Create</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateBranch} onOpenChange={setShowCreateBranch}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Create Branch</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Name</Label>
              <Input value={branchForm.name} onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Address</Label>
              <Input value={branchForm.address} onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Phone</Label>
              <Input value={branchForm.phone} onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateBranch(false)}>Cancel</Button>
              <Button onClick={handleCreateBranch} disabled={submitting}>Create</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </AdminShell>
  )
}
