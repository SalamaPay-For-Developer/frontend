"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserCircleIcon, LogoutSquareIcon } from "@hugeicons/core-free-icons"

export default function ProfilePage() {
  const { user, logout } = useAuth()

  return (
    <DashboardShell breadcrumb="Profile">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
              <HugeiconsIcon icon={UserCircleIcon} className="size-10 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg">{user?.full_name || "User"}</p>
              <p className="text-sm text-muted-foreground">{user?.phone_number}</p>
            </div>
            <Badge variant={user?.is_verified ? "default" : "secondary"}>
              {user?.is_verified ? "Verified" : "Unverified"}
            </Badge>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={user?.full_name || ""} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue={user?.phone_number || ""} disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user?.email || ""} placeholder="your@email.com" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Security</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Change Password</p>
              <p className="text-sm text-muted-foreground">Update your account password</p>
            </div>
            <Button variant="outline">Change</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-destructive">Sign Out</p>
              <p className="text-sm text-muted-foreground">Sign out of your account</p>
            </div>
            <Button variant="outline" onClick={logout}>
              <HugeiconsIcon icon={LogoutSquareIcon} className="size-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
