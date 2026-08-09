"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HugeiconsIcon } from "@hugeicons/react"
import { Settings05Icon, BellIcon, Globe02Icon, Moon02Icon } from "@hugeicons/core-free-icons"

export default function SettingsPage() {
  return (
    <DashboardShell breadcrumb="Settings">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your account preferences.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={BellIcon} className="size-5 text-muted-foreground" />
              <div>
                <Label>Payment Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified about payment activity</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={BellIcon} className="size-5 text-muted-foreground" />
              <div>
                <Label>Transaction Alerts</Label>
                <p className="text-sm text-muted-foreground">SMS alerts for transactions</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={BellIcon} className="size-5 text-muted-foreground" />
              <div>
                <Label>Security Alerts</Label>
                <p className="text-sm text-muted-foreground">Login and security notifications</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={Globe02Icon} className="size-5 text-muted-foreground" />
              <div>
                <Label>Language</Label>
                <p className="text-sm text-muted-foreground">Display language</p>
              </div>
            </div>
            <Select defaultValue="en">
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="sw">Kiswahili</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={Moon02Icon} className="size-5 text-muted-foreground" />
              <div>
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">Light or dark mode</p>
              </div>
            </div>
            <Select defaultValue="system">
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button>Save Settings</Button>
    </DashboardShell>
  )
}
