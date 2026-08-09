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
import { paymentsApi, walletsApi } from "@/lib/api"
import type { Transaction, Wallet } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  BankIcon,
  ArrowUp01Icon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  Clock01Icon,
  Download04Icon,
} from "@hugeicons/core-free-icons"

const STATUS_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  SUCCESS: "default",
  PENDING: "secondary",
  PROCESSING: "secondary",
  FAILED: "destructive",
}

export default function DeveloperSettlementsPage() {
  const [payouts, setPayouts] = useState<Transaction[]>([])
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawChannel, setWithdrawChannel] = useState("BANK")
  const [withdrawAccount, setWithdrawAccount] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txData, walletData] = await Promise.all([
          paymentsApi.transactions().catch(() => []),
          walletsApi.list().catch(() => []),
        ])
        setPayouts(txData.filter((t) => t.type === "PAYOUT"))
        if (walletData.length > 0) setWallet(walletData[0])
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawAccount) {
      setError("Amount and account are required")
      return
    }
    setSubmitting(true)
    setError("")
    setSuccess("")
    try {
      // Use the collect endpoint as a proxy for now - in production this would be a payout endpoint
      const result = await paymentsApi.collect({
        business_id: "dev",
        amount: withdrawAmount,
        category_code: "PAYOUT",
        channel: withdrawChannel,
        payer_msisdn: withdrawAccount,
      })
      setPayouts([result, ...payouts])
      setShowWithdraw(false)
      setWithdrawAmount("")
      setWithdrawAccount("")
      setSuccess(`Settlement initiated! Reference: ${result.reference}`)
    } catch {
      setError("Failed to initiate settlement. Make sure Selcom is connected.")
    } finally {
      setSubmitting(false)
    }
  }

  const totalSettled = payouts
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + Number(p.amount), 0)

  const totalFees = payouts
    .filter((p) => p.status === "SUCCESS" && p.fee_amount)
    .reduce((sum, p) => sum + Number(p.fee_amount), 0)

  return (
    <DeveloperShell breadcrumb="Settlements">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settlements</h1>
          <p className="text-sm text-muted-foreground">Manage payouts and view settlement reports.</p>
        </div>
        <Button onClick={() => setShowWithdraw(true)}>
          <HugeiconsIcon icon={ArrowUp01Icon} className="size-4" />
          New Settlement
        </Button>
      </div>

      {/* Wallet Balance + Stats */}
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Available Balance</p>
            <p className="text-xl font-bold">TZS {Number(wallet?.balance || 0).toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Settled</p>
            <p className="text-xl font-bold">TZS {totalSettled.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Fees Paid</p>
            <p className="text-xl font-bold">TZS {totalFees.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Pending Settlements</p>
            <p className="text-xl font-bold">{payouts.filter((p) => p.status === "PENDING" || p.status === "PROCESSING").length}</p>
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
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Settlement History
            <Button variant="ghost" size="sm">
              <HugeiconsIcon icon={Download04Icon} className="size-4" />
              Export
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8"><Spinner className="size-6" /></div>
          ) : payouts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <HugeiconsIcon icon={BankIcon} className="size-12 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">No settlements yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.reference}</TableCell>
                    <TableCell className="text-xs">{p.channel}</TableCell>
                    <TableCell className="text-xs">{p.payer_msisdn || "—"}</TableCell>
                    <TableCell className="font-medium text-xs">{p.currency} {Number(p.amount).toLocaleString()}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.fee_amount ? `${Number(p.fee_amount).toLocaleString()}` : "—"}</TableCell>
                    <TableCell><Badge variant={STATUS_COLORS[p.status] || "outline"}>{p.status}</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-xs">{new Date(p.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {showWithdraw && (
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardHeader><CardTitle className="text-sm">New Settlement</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="rounded-lg bg-muted/30 p-3 text-sm">
              <span className="text-muted-foreground">Available: </span>
              <span className="font-bold">TZS {Number(wallet?.balance || 0).toLocaleString()}</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>Amount (TZS)</Label>
                <Input type="number" placeholder="10000" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Channel</Label>
                <Select value={withdrawChannel} onValueChange={(v) => setWithdrawChannel(v || "BANK")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BANK">Bank Transfer</SelectItem>
                    <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>{withdrawChannel === "BANK" ? "Bank Account Number" : "Mobile Money Number"}</Label>
              <Input placeholder={withdrawChannel === "BANK" ? "0123456789" : "255712345678"} value={withdrawAccount} onChange={(e) => setWithdrawAccount(e.target.value)} />
            </div>
            <div className="rounded-lg bg-muted/20 p-3 text-xs text-muted-foreground">
              Fee: 2% (min 500 TZS) · Settlements are processed within 24 hours for bank, instantly for mobile money.
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-3">
              <Button onClick={handleWithdraw} disabled={submitting}>
                {submitting ? <Spinner className="size-4" /> : <HugeiconsIcon icon={ArrowUp01Icon} className="size-4" />}
                Initiate Settlement
              </Button>
              <Button variant="outline" onClick={() => setShowWithdraw(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </DeveloperShell>
  )
}
