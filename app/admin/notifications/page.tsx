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
import { Separator } from "@/components/ui/separator"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { adminApi } from "@/lib/api"
import type { SystemNotification } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, BellIcon } from "@hugeicons/core-free-icons"

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<SystemNotification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ title: "", message: "", channel: "SYSTEM", target_type: "ALL" })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setNotifications(await adminApi.notifications())
      } catch { /* ignore */ } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSend = async () => {
    if (!form.title || !form.message) return
    setSubmitting(true)
    try {
      const notif = await adminApi.sendNotification(form)
      setNotifications([notif, ...notifications])
      setShowCreate(false)
      setForm({ title: "", message: "", channel: "SYSTEM", target_type: "ALL" })
    } catch { /* ignore */ } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminShell breadcrumb="Notifications">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Send system-wide notifications.</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          Send Notification
        </Button>
      </div>

      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8"><Spinner className="size-6" /></div>
          ) : notifications.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">No notifications sent yet.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3 rounded-lg border p-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <HugeiconsIcon icon={BellIcon} className="size-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{n.title}</p>
                      <Badge variant="outline">{n.channel}</Badge>
                      <Badge variant="secondary">{n.target_type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Sent by {n.sent_by_name || "System"} on {n.sent_at ? new Date(n.sent_at).toLocaleString() : "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Send Notification</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Message</Label>
              <textarea
                className="rounded-lg border bg-background p-3 min-h-[100px] resize-y text-sm"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Channel</Label>
                <Select value={form.channel} onValueChange={(v: string | null) => v && setForm({ ...form, channel: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SYSTEM">System</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="EMAIL">Email</SelectItem>
                    <SelectItem value="PUSH">Push</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Target</Label>
                <Select value={form.target_type} onValueChange={(v: string | null) => v && setForm({ ...form, target_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Users</SelectItem>
                    <SelectItem value="BUSINESSES">Businesses</SelectItem>
                    <SelectItem value="DEVELOPERS">Developers</SelectItem>
                    <SelectItem value="STAFF">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button onClick={handleSend} disabled={submitting}>Send</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </AdminShell>
  )
}
