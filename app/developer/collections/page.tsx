"use client"

import { useState, useEffect } from "react"
import { DeveloperShell } from "@/components/developer-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { paymentsApi } from "@/lib/api"
import type { Transaction } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  PlusSignIcon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  Clock01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"

const CHANNELS = [
  { value: "MPESA", label: "M-Pesa" },
  { value: "TIGOPESA", label: "Tigo Pesa" },
  { value: "AIRTEL", label: "Airtel Money" },
  { value: "HALOPESA", label: "Halo Pesa" },
]

const STATUS_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  SUCCESS: "default",
  PENDING: "secondary",
  PROCESSING: "secondary",
  FAILED: "destructive",
}

export default function DeveloperCollectionsPage() {
  const [collections, setCollections] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [amount, setAmount] = useState("")
  const [channel, setChannel] = useState("MPESA")
  const [payerPhone, setPayerPhone] = useState("")
  const [categoryCode, setCategoryCode] = useState("GENERAL")
  const [businessId, setBusinessId] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await paymentsApi.transactions()
        setCollections(data.filter((t) => t.type === "COLLECTION"))
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleCreate = async () => {
    if (!amount || !payerPhone) {
      setError("Amount and payer phone are required")
      return
    }
    setSubmitting(true)
    setError("")
    setSuccess("")
    try {
      const result = await paymentsApi.collect({
        business_id: businessId || "dev",
        amount,
        category_code: categoryCode,
        channel,
        payer_msisdn: payerPhone,
      })
      setCollections([result, ...collections])
      setShowCreate(false)
      setAmount("")
      setPayerPhone("")
      setSuccess(`Collection initiated! Reference: ${result.reference}`)
    } catch {
      setError("Failed to initiate collection. Make sure Selcom is connected.")
    } finally {
      setSubmitting(false)
    }
  }

  const totalCollected = collections
    .filter((c) => c.status === "SUCCESS")
    .reduce((sum, c) => sum + Number(c.amount), 0)

  return (
    <DeveloperShell breadcrumb="Collections">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">C2B Collections</h1>
          <p className="text-sm text-muted-foreground">Collect payments from customers via mobile money push (USSD).</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          New Collection
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Collected</p>
            <p className="text-xl font-bold">TZS {totalCollected.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Collections</p>
            <p className="text-xl font-bold">{collections.length}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-xl font-bold">{collections.filter((c) => c.status === "PENDING" || c.status === "PROCESSING").length}</p>
          </CardContent>
        </Card>
      </div>

      {success && (
        <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
          <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" />
          {success}
        </div>
      )}

      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardHeader><CardTitle className="text-sm">Collection History</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8"><Spinner className="size-6" /></div>
          ) : collections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <HugeiconsIcon icon={ArrowDown01Icon} className="size-12 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">No collections yet. Create one to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Payer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collections.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-xs">{c.reference}</TableCell>
                    <TableCell className="text-xs">{c.channel}</TableCell>
                    <TableCell className="text-xs">{c.payer_msisdn || "—"}</TableCell>
                    <TableCell className="font-medium text-xs">{c.currency} {Number(c.amount).toLocaleString()}</TableCell>
                    <TableCell><Badge variant={STATUS_COLORS[c.status] || "outline"}>{c.status}</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-xs">{new Date(c.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {showCreate && (
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardHeader><CardTitle className="text-sm">New Collection</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>Amount (TZS)</Label>
                <Input type="number" placeholder="50000" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Channel</Label>
                <Select value={channel} onValueChange={(v) => setChannel(v || "MPESA")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CHANNELS.map((ch) => (
                      <SelectItem key={ch.value} value={ch.value}>{ch.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>Payer Phone</Label>
                <Input placeholder="255712345678" value={payerPhone} onChange={(e) => setPayerPhone(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Category Code</Label>
                <Input placeholder="GENERAL" value={categoryCode} onChange={(e) => setCategoryCode(e.target.value)} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Business ID (optional)</Label>
              <Input placeholder="Your business ID" value={businessId} onChange={(e) => setBusinessId(e.target.value)} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-3">
              <Button onClick={handleCreate} disabled={submitting}>
                {submitting ? <Spinner className="size-4" /> : <HugeiconsIcon icon={ArrowDown01Icon} className="size-4" />}
                Initiate Collection
              </Button>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </DeveloperShell>
  )
}
