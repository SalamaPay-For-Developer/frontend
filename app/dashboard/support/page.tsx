"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { HugeiconsIcon } from "@hugeicons/react"
import { CustomerSupportIcon, PlusSignIcon } from "@hugeicons/core-free-icons"

const TICKET_CATEGORIES = [
  { value: "PAYMENT_ISSUE", label: "Payment Issue" },
  { value: "REFUND", label: "Refund" },
  { value: "SETTLEMENT", label: "Settlement" },
  { value: "KYC", label: "KYC" },
  { value: "ACCOUNT", label: "Account" },
  { value: "TECHNICAL", label: "Technical Issue" },
  { value: "OTHER", label: "Other" },
]

export default function SupportPage() {
  const [showForm, setShowForm] = useState(false)
  const [subject, setSubject] = useState("")
  const [category, setCategory] = useState("PAYMENT_ISSUE")
  const [description, setDescription] = useState("")
  const [txRef, setTxRef] = useState("")

  return (
    <DashboardShell breadcrumb="Support">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Support</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Get help with your account and transactions.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          Create Ticket
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>Create Support Ticket</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-4 max-w-lg">
            <div className="flex flex-col gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Brief description of your issue" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v || "PAYMENT_ISSUE")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TICKET_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="txref">Transaction Reference (optional)</Label>
              <Input id="txref" placeholder="SP-XXXXXXXX" value={txRef} onChange={(e) => setTxRef(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" placeholder="Describe your issue in detail..." value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
            </div>
            <div className="flex gap-2">
              <Button>Submit Ticket</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Your Tickets</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <HugeiconsIcon icon={CustomerSupportIcon} className="size-12 text-muted-foreground" />
            <p className="text-muted-foreground">No support tickets yet.</p>
            <Button variant="outline" onClick={() => setShowForm(true)}>
              <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
              Create your first ticket
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
