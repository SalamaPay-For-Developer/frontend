"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
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
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { businessApi } from "@/lib/api"
import type { BusinessMember, BusinessRole } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserGroupIcon, PlusSignIcon } from "@hugeicons/core-free-icons"

const ROLES: { value: BusinessRole; label: string }[] = [
  { value: "OWNER", label: "Owner" },
  { value: "MANAGER", label: "Manager" },
  { value: "CASHIER", label: "Cashier" },
  { value: "RECEPTIONIST", label: "Receptionist" },
  { value: "WAITER", label: "Waiter" },
  { value: "KITCHEN", label: "Kitchen Staff" },
  { value: "ADMINISTRATOR", label: "Administrator" },
  { value: "ACCOUNTANT", label: "Accountant" },
  { value: "TEACHER", label: "Teacher" },
  { value: "STAFF", label: "Staff" },
]

export default function StaffPage() {
  const { activeBusiness } = useAuth()
  const [members, setMembers] = useState<BusinessMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showInvite, setShowInvite] = useState(false)
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState<BusinessRole>("STAFF")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchMembers = async () => {
      if (!activeBusiness) {
        setIsLoading(false)
        return
      }
      try {
        const data = await businessApi.members(activeBusiness.id)
        setMembers(data)
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }
    fetchMembers()
  }, [activeBusiness])

  const handleInvite = async () => {
    if (!phone.trim() || !activeBusiness) {
      setError("Phone number is required")
      return
    }
    setSubmitting(true)
    setError("")
    try {
      const member = await businessApi.addMember(activeBusiness.id, {
        user_phone: phone,
        role,
      })
      setMembers([...members, member])
      setShowInvite(false)
      setPhone("")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add member"
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (!activeBusiness) {
    return (
      <DashboardShell breadcrumb="Staff & Roles">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
            <HugeiconsIcon icon={UserGroupIcon} className="size-12 text-muted-foreground" />
            <p className="text-muted-foreground">Select a business to manage staff.</p>
          </CardContent>
        </Card>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell breadcrumb="Staff & Roles">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Staff & Roles</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage team members for {activeBusiness.business_name}.</p>
        </div>
        <Button onClick={() => setShowInvite(true)}>
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          Add Member
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Team Members ({members.length})</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8"><Spinner className="size-6" /></div>
          ) : members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <HugeiconsIcon icon={UserGroupIcon} className="size-12 text-muted-foreground" />
              <p className="text-muted-foreground">No team members yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.user_name || "Unknown"}</TableCell>
                    <TableCell>{m.user_phone || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{m.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={m.is_active ? "default" : "secondary"}>
                        {m.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>Invite a staff member to your business.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="2557XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole((v as BusinessRole) || "STAFF")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={handleInvite} disabled={submitting}>
              {submitting ? <Spinner className="size-4" /> : <HugeiconsIcon icon={PlusSignIcon} className="size-4" />}
              Add Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
