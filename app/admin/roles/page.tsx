"use client"

import { useState, useEffect } from "react"
import { AdminShell } from "@/components/admin-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { adminApi } from "@/lib/api"
import type { Role, Permission } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Key01Icon } from "@hugeicons/core-free-icons"

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [showPerms, setShowPerms] = useState<Role | null>(null)
  const [newRoleName, setNewRoleName] = useState("")
  const [selectedPerms, setSelectedPerms] = useState<Set<string>>(new Set())
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [r, p] = await Promise.all([adminApi.roles(), adminApi.permissions()])
        setRoles(r)
        setPermissions(p)
      } catch { /* ignore */ } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleCreate = async () => {
    if (!newRoleName) return
    setSubmitting(true)
    try {
      const role = await adminApi.createRole({
        name: newRoleName,
        permission_codes: Array.from(selectedPerms),
      })
      setRoles([role, ...roles])
      setShowCreate(false)
      setNewRoleName("")
      setSelectedPerms(new Set())
    } catch { /* ignore */ } finally {
      setSubmitting(false)
    }
  }

  const openPerms = (role: Role) => {
    setShowPerms(role)
    setSelectedPerms(new Set(role.permissions.map((p) => p.code)))
  }

  const savePerms = async () => {
    if (!showPerms) return
    setSubmitting(true)
    try {
      const updated = await adminApi.updateRole(showPerms.id, {
        permission_codes: Array.from(selectedPerms),
      })
      setRoles(roles.map((r) => r.id === updated.id ? updated : r))
      setShowPerms(null)
    } catch { /* ignore */ } finally {
      setSubmitting(false)
    }
  }

  const togglePerm = (code: string) => {
    const next = new Set(selectedPerms)
    if (next.has(code)) next.delete(code)
    else next.add(code)
    setSelectedPerms(next)
  }

  const groupedPerms = permissions.reduce<Record<string, Permission[]>>((acc, p) => {
    if (!acc[p.module]) acc[p.module] = []
    acc[p.module].push(p)
    return acc
  }, {})

  if (isLoading) {
    return (
      <AdminShell breadcrumb="Roles">
        <div className="flex items-center justify-center py-12"><Spinner className="size-8" /></div>
      </AdminShell>
    )
  }

  return (
    <AdminShell breadcrumb="Roles">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
          <p className="text-muted-foreground">Define roles and assign granular permissions.</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          Create Role
        </Button>
      </div>

      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Builtin</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.is_builtin && <Badge variant="secondary">Builtin</Badge>}</TableCell>
                  <TableCell className="text-sm">{r.permissions.length}</TableCell>
                  <TableCell className="text-sm">{r.staff_count}</TableCell>
                  <TableCell>
                    <Badge variant={r.is_active ? "default" : "secondary"}>
                      {r.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => openPerms(r)}>Permissions</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Create Role</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Role Name</Label>
              <Input value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} placeholder="e.g. Operations Manager" />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={submitting || !newRoleName}>Create</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!showPerms} onOpenChange={(open) => !open && setShowPerms(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Permissions — {showPerms?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {Object.entries(groupedPerms).map(([module, perms]) => (
              <div key={module}>
                <p className="text-sm font-medium mb-2 capitalize">{module}</p>
                <div className="grid grid-cols-2 gap-2">
                  {perms.map((p) => (
                    <label key={p.code} className="flex items-center gap-2 rounded-lg border p-2 cursor-pointer hover:bg-accent">
                      <Checkbox
                        checked={selectedPerms.has(p.code)}
                        onCheckedChange={() => togglePerm(p.code)}
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-mono">{p.code}</span>
                        <span className="text-xs text-muted-foreground">{p.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPerms(null)}>Cancel</Button>
              <Button onClick={savePerms} disabled={submitting}>Save Permissions</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </AdminShell>
  )
}
