"use client"

import { useState } from "react"
import { DeveloperShell } from "@/components/developer-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserGroupIcon,
  PlusSignIcon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons"

interface TeamMember {
  id: string
  name: string
  email: string
  role: "OWNER" | "ADMIN" | "DEVELOPER" | "VIEWER"
  status: "ACTIVE" | "PENDING" | "SUSPENDED"
  joinedAt: string
}

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  DEVELOPER: "Developer",
  VIEWER: "Viewer",
}

const ROLE_VARIANTS: Record<string, "default" | "secondary" | "outline"> = {
  OWNER: "default",
  ADMIN: "default",
  DEVELOPER: "secondary",
  VIEWER: "outline",
}

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive"> = {
  ACTIVE: "default",
  PENDING: "secondary",
  SUSPENDED: "destructive",
}

const PERMISSIONS: Record<string, string[]> = {
  OWNER: ["Full access", "Manage billing", "Delete workspace", "Manage members"],
  ADMIN: ["Manage members", "Manage API keys", "Manage webhooks", "View all data"],
  DEVELOPER: ["Create checkouts", "View transactions", "Manage webhooks", "View logs"],
  VIEWER: ["View transactions", "View logs", "View analytics"],
}

export default function DeveloperTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "You",
      email: "you@business.co.tz",
      role: "OWNER",
      status: "ACTIVE",
      joinedAt: new Date().toISOString(),
    },
  ])
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("DEVELOPER")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleInvite = async () => {
    if (!inviteEmail) {
      setError("Email is required")
      return
    }
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole as TeamMember["role"],
      status: "PENDING",
      joinedAt: new Date().toISOString(),
    }
    setMembers([...members, newMember])
    setShowInvite(false)
    setInviteEmail("")
    setSuccess(`Invitation sent to ${newMember.email}`)
    setTimeout(() => setSuccess(""), 3000)
  }

  const handleRemove = (id: string) => {
    setMembers(members.filter((m) => m.id !== id))
  }

  return (
    <DeveloperShell breadcrumb="Team">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-sm text-muted-foreground">Manage team members and their access to your developer workspace.</p>
        </div>
        <Button onClick={() => setShowInvite(true)}>
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          Invite Member
        </Button>
      </div>

      {success && (
        <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
          <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" />
          {success}
        </div>
      )}

      {/* Team Members */}
      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardHeader><CardTitle className="text-sm">Team Members ({members.length})</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{member.name}</p>
                    <Badge variant={ROLE_VARIANTS[member.role]}>{ROLE_LABELS[member.role]}</Badge>
                    <Badge variant={STATUS_VARIANTS[member.status]}>
                      {member.status === "ACTIVE" && <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-3" />}
                      {member.status === "PENDING" && <HugeiconsIcon icon={Clock01Icon} className="size-3" />}
                      {member.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
              </div>
              {member.role !== "OWNER" && (
                <Button size="sm" variant="ghost" onClick={() => handleRemove(member.id)}>
                  <HugeiconsIcon icon={Cancel01Icon} className="size-4 text-destructive" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Roles & Permissions */}
      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardHeader><CardTitle className="text-sm">Roles & Permissions</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-4">
          {Object.entries(PERMISSIONS).map(([role, perms]) => (
            <div key={role} className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={ROLE_VARIANTS[role]}>{ROLE_LABELS[role]}</Badge>
                <span className="text-xs text-muted-foreground">{perms.length} permissions</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {perms.map((perm) => (
                  <span key={perm} className="text-xs rounded-md bg-muted px-2 py-1">{perm}</span>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Invite Dialog */}
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>Send an invitation to join your developer workspace.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Email Address</Label>
              <Input type="email" placeholder="developer@business.co.tz" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v || "DEVELOPER")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin - Full management access</SelectItem>
                  <SelectItem value="DEVELOPER">Developer - Create and manage integrations</SelectItem>
                  <SelectItem value="VIEWER">Viewer - Read-only access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvite(false)}>Cancel</Button>
            <Button onClick={handleInvite}>
              <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DeveloperShell>
  )
}
