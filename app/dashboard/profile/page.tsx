"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserCircleIcon,
  LogoutSquareIcon,
  BellIcon,
  LockPasswordIcon,
  Settings05Icon,
  BookOpen01Icon,
  ArrowUpRight01Icon,
  File02Icon,
  Key01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("account")

  return (
    <DashboardShell breadcrumb="Profile">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your account, notifications and documentation.</p>
      </div>

      {/* User summary card */}
      <Card>
        <CardContent className="flex items-center gap-4 pt-6 flex-wrap">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 shrink-0">
            <HugeiconsIcon icon={UserCircleIcon} className="size-8 text-primary" />
          </div>
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-lg truncate">{user?.full_name || "User"}</p>
              <Badge variant={user?.is_verified ? "default" : "secondary"}>
                {user?.is_verified ? "Verified" : "Unverified"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{user?.phone_number}</p>
            {user?.email && <p className="text-sm text-muted-foreground">{user?.email}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="account">
            <HugeiconsIcon icon={Settings05Icon} className="size-4" />
            Account Settings
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <HugeiconsIcon icon={BellIcon} className="size-4" />
            Notification Profile
          </TabsTrigger>
          <TabsTrigger value="docs">
            <HugeiconsIcon icon={BookOpen01Icon} className="size-4" />
            Documentation
          </TabsTrigger>
        </TabsList>

        {/* Account Settings Tab */}
        <TabsContent value="account">
          <div className="flex flex-col gap-4">
            <Card>
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
                <Button className="w-fit">Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Security</CardTitle></CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <HugeiconsIcon icon={LockPasswordIcon} className="size-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Change Password</p>
                      <p className="text-sm text-muted-foreground">Update your account password</p>
                    </div>
                  </div>
                  <Button variant="outline">Change</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <HugeiconsIcon icon={LogoutSquareIcon} className="size-5 text-destructive" />
                    <div>
                      <p className="font-medium text-destructive">Sign Out</p>
                      <p className="text-sm text-muted-foreground">Sign out of your account</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={logout}>
                    <HugeiconsIcon icon={LogoutSquareIcon} className="size-4" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notification Profile Tab */}
        <TabsContent value="notifications">
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
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
                <div className="flex items-center justify-between flex-wrap gap-2">
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
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <HugeiconsIcon icon={BellIcon} className="size-5 text-muted-foreground" />
                    <div>
                      <Label>Security Alerts</Label>
                      <p className="text-sm text-muted-foreground">Login and security notifications</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <HugeiconsIcon icon={BellIcon} className="size-5 text-muted-foreground" />
                    <div>
                      <Label>Settlement Notifications</Label>
                      <p className="text-sm text-muted-foreground">Updates on settlement requests</p>
                    </div>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <HugeiconsIcon icon={BellIcon} className="size-5 text-muted-foreground" />
                    <div>
                      <Label>Marketing & Product Updates</Label>
                      <p className="text-sm text-muted-foreground">News about new features and offers</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Channels</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <HugeiconsIcon icon={BellIcon} className="size-5 text-muted-foreground" />
                    <div>
                      <Label>SMS</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <HugeiconsIcon icon={BellIcon} className="size-5 text-muted-foreground" />
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <HugeiconsIcon icon={BellIcon} className="size-5 text-muted-foreground" />
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">In-app and browser push notifications</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Button className="w-fit">Save Notification Preferences</Button>
          </div>
        </TabsContent>

        {/* Documentation Tab */}
        <TabsContent value="docs">
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Documentation & Resources</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <a
                  href="#"
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors flex-wrap gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <HugeiconsIcon icon={File02Icon} className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">API Reference</p>
                      <p className="text-sm text-muted-foreground">Full REST API documentation for developers</p>
                    </div>
                  </div>
                  <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4 text-muted-foreground" />
                </a>

                <a
                  href="#"
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors flex-wrap gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <HugeiconsIcon icon={BookOpen01Icon} className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Integration Guide</p>
                      <p className="text-sm text-muted-foreground">Step-by-step guide to integrate Salamapay</p>
                    </div>
                  </div>
                  <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4 text-muted-foreground" />
                </a>

                <a
                  href="#"
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors flex-wrap gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <HugeiconsIcon icon={Key01Icon} className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">API Keys & Webhooks</p>
                      <p className="text-sm text-muted-foreground">Manage your API keys and webhook endpoints</p>
                    </div>
                  </div>
                  <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4 text-muted-foreground" />
                </a>

                <a
                  href="#"
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors flex-wrap gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <HugeiconsIcon icon={InformationCircleIcon} className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Help Center</p>
                      <p className="text-sm text-muted-foreground">FAQs, tutorials, and troubleshooting guides</p>
                    </div>
                  </div>
                  <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4 text-muted-foreground" />
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Developer Resources</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <a
                  href="#"
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors flex-wrap gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-muted shrink-0">
                      <HugeiconsIcon icon={File02Icon} className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">SDK Downloads</p>
                      <p className="text-sm text-muted-foreground">Download SDKs for Python, PHP, Dart, and more</p>
                    </div>
                  </div>
                  <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4 text-muted-foreground" />
                </a>

                <a
                  href="#"
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors flex-wrap gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-muted shrink-0">
                      <HugeiconsIcon icon={BookOpen01Icon} className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Changelog</p>
                      <p className="text-sm text-muted-foreground">Latest updates and version history</p>
                    </div>
                  </div>
                  <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4 text-muted-foreground" />
                </a>

                <a
                  href="#"
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors flex-wrap gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-muted shrink-0">
                      <HugeiconsIcon icon={InformationCircleIcon} className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Status Page</p>
                      <p className="text-sm text-muted-foreground">Check system status and incident reports</p>
                    </div>
                  </div>
                  <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4 text-muted-foreground" />
                </a>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
