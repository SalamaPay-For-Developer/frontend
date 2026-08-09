"use client"

import { useState, useEffect } from "react"
import { AdminShell } from "@/components/admin-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { adminApi } from "@/lib/api"
import type { AdminSupportTicket, AdminTicketComment } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { CustomerSupportIcon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons"

const STATUS_BADGE: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  OPEN: "secondary",
  PENDING: "secondary",
  IN_PROGRESS: "default",
  RESOLVED: "default",
  CLOSED: "outline",
}

const PRIORITY_BADGE: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  LOW: "outline",
  MEDIUM: "secondary",
  HIGH: "default",
  URGENT: "destructive",
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<AdminSupportTicket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selected, setSelected] = useState<AdminSupportTicket | null>(null)
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { fetchTickets() }, [])

  const fetchTickets = async () => {
    setIsLoading(true)
    try {
      const params: Record<string, string> = {}
      if (statusFilter !== "ALL") params.status = statusFilter
      setTickets(await adminApi.tickets(params))
    } catch { /* ignore */ } finally {
      setIsLoading(false)
    }
  }

  const handleView = async (t: AdminSupportTicket) => {
    try {
      const detail = await adminApi.ticket(t.id)
      setSelected(detail)
    } catch {
      setSelected(t)
    }
  }

  const handleResolve = async () => {
    if (!selected) return
    setSubmitting(true)
    try {
      await adminApi.resolveTicket(selected.id, "Resolved by admin")
      setTickets(tickets.map((t) => t.id === selected.id ? { ...t, status: "RESOLVED" } : t))
      setSelected(null)
    } catch { /* ignore */ } finally {
      setSubmitting(false)
    }
  }

  const handleComment = async () => {
    if (!selected || !comment) return
    setSubmitting(true)
    try {
      const c = await adminApi.commentTicket(selected.id, comment)
      setSelected({ ...selected, comments: [...selected.comments, c] })
      setComment("")
    } catch { /* ignore */ } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminShell breadcrumb="Tickets">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
        <p className="text-muted-foreground">Manage customer support tickets.</p>
      </div>

      <div className="flex gap-2">
        {["ALL", "OPEN", "PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((s) => (
          <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm"
            onClick={() => { setStatusFilter(s); setTimeout(fetchTickets, 0) }}>
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
                  <TableHead>Ticket #</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.slice(0, 50).map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono text-sm">{t.ticket_number}</TableCell>
                    <TableCell className="font-medium">{t.subject}</TableCell>
                    <TableCell><Badge variant="outline">{t.category}</Badge></TableCell>
                    <TableCell><Badge variant={PRIORITY_BADGE[t.priority] || "outline"}>{t.priority}</Badge></TableCell>
                    <TableCell><Badge variant={STATUS_BADGE[t.status] || "outline"}>{t.status.replace(/_/g, " ")}</Badge></TableCell>
                    <TableCell className="text-sm">{t.assigned_to_name || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" onClick={() => handleView(t)}>View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{selected?.ticket_number} — {selected?.subject}</DialogTitle></DialogHeader>
          {selected && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Category: </span>{selected.category}</div>
                <div><span className="text-muted-foreground">Priority: </span>{selected.priority}</div>
                <div><span className="text-muted-foreground">Status: </span>{selected.status.replace(/_/g, " ")}</div>
                <div><span className="text-muted-foreground">User: </span>{selected.user_name || "—"}</div>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-1">Description</p>
                <p className="text-sm text-muted-foreground">{selected.description}</p>
              </div>

              {selected.comments.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-2">Comments</p>
                    <div className="flex flex-col gap-2">
                      {selected.comments.map((c) => (
                        <div key={c.id} className={`rounded-lg border p-3 ${c.is_internal ? "bg-muted" : ""}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium">{c.author_name}</span>
                            <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</span>
                          </div>
                          <p className="text-sm">{c.comment}</p>
                          {c.is_internal && <Badge variant="outline" className="mt-1 text-xs">Internal</Badge>}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />
              <div className="flex flex-col gap-2">
                <Label>Add Comment</Label>
                <div className="flex gap-2">
                  <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Type a comment..." />
                  <Button onClick={handleComment} disabled={submitting || !comment}>Send</Button>
                </div>
              </div>

              {selected.status !== "RESOLVED" && selected.status !== "CLOSED" && (
                <Button variant="outline" onClick={handleResolve} disabled={submitting}>
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" />
                  Resolve Ticket
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminShell>
  )
}
