"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { paymentsApi, adminApi } from "@/lib/api"
import type { Transaction, PaymentCategory, FeeConfig } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  QrCode01Icon,
  Link02Icon,
  Search01Icon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  PlusSignIcon,
  CreditCardIcon,
  FilterIcon,
} from "@hugeicons/core-free-icons"

const STATUS_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  SUCCESS: "default",
  PENDING: "secondary",
  PROCESSING: "secondary",
  FAILED: "destructive",
  REVERSED: "destructive",
  EXPIRED: "outline",
}

type DrawerMode = "receive" | "make" | "qr" | "link" | null

interface PaymentProfile {
  id: string
  name: string
  payment_method: "MOBILE_MONEY" | "CARD" | "QR" | "BANK"
  phone?: string
  description?: string
  created_at: string
}

export default function PaymentsPage() {
  const { activeBusiness, businesses } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<PaymentCategory[]>([])
  const [fees, setFees] = useState<FeeConfig[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Filter state
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [channelFilter, setChannelFilter] = useState("ALL")
  const [showFilters, setShowFilters] = useState(false)

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null)

  // Receive payment form
  const [selectedBiz, setSelectedBiz] = useState(activeBusiness?.id || "")
  const [amount, setAmount] = useState("")
  const [phone, setPhone] = useState("")
  const [channel, setChannel] = useState("MPESA")
  const [category, setCategory] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<Transaction | null>(null)
  const [formError, setFormError] = useState("")

  // Payment Link form
  const [linkAmount, setLinkAmount] = useState("")
  const [linkDesc, setLinkDesc] = useState("")
  const [selectedProfile, setSelectedProfile] = useState("")
  const [profiles, setProfiles] = useState<PaymentProfile[]>([])
  const [showCreateProfile, setShowCreateProfile] = useState(false)
  const [newProfileName, setNewProfileName] = useState("")
  const [newProfileMethod, setNewProfileMethod] = useState("MOBILE_MONEY")
  const [newProfilePhone, setNewProfilePhone] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txData, catData] = await Promise.all([
          paymentsApi.transactions(),
          paymentsApi.categories(),
        ])
        setTransactions(txData)
        setCategories(catData)
        if (catData.length > 0) setCategory(catData[0].code)
      } catch {
        setError("Failed to load payment data.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (activeBusiness) setSelectedBiz(activeBusiness.id)
  }, [activeBusiness])

  // Fetch fees
  useEffect(() => {
    const fetchFees = async () => {
      try {
        const data = await adminApi.fees()
        setFees(data)
      } catch {
        // fees may not be available for non-admin users
      }
    }
    fetchFees()
  }, [])

  // Load profiles from localStorage (client-side persistence)
  useEffect(() => {
    const stored = localStorage.getItem("payment_profiles")
    if (stored) {
      try {
        setProfiles(JSON.parse(stored))
      } catch {
        // ignore
      }
    }
  }, [])

  const saveProfiles = (updated: PaymentProfile[]) => {
    setProfiles(updated)
    localStorage.setItem("payment_profiles", JSON.stringify(updated))
  }

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        !search ||
        tx.reference.toLowerCase().includes(search.toLowerCase()) ||
        tx.channel.toLowerCase().includes(search.toLowerCase()) ||
        (tx.payer_msisdn || "").includes(search)
      const matchesStatus = statusFilter === "ALL" || tx.status === statusFilter
      const matchesChannel = channelFilter === "ALL" || tx.channel === channelFilter
      return matchesSearch && matchesStatus && matchesChannel
    })
  }, [transactions, search, statusFilter, channelFilter])

  const counts = useMemo(() => {
    const c: Record<string, number> = { ALL: transactions.length }
    for (const tx of transactions) {
      c[tx.status] = (c[tx.status] || 0) + 1
    }
    return c
  }, [transactions])

  const channels = [
    { value: "MPESA", label: "M-Pesa" },
    { value: "TIGOPESA", label: "Tigo Pesa" },
    { value: "AIRTEL", label: "Airtel Money" },
    { value: "HALOPESA", label: "HaloPesa" },
  ]

  const openDrawer = (mode: DrawerMode) => {
    setDrawerMode(mode)
    setDrawerOpen(true)
    setResult(null)
    setFormError("")
  }

  const handleCollect = async () => {
    if (!selectedBiz || !amount || !phone || !category) {
      setFormError("Please fill all fields")
      return
    }
    setSubmitting(true)
    try {
      const tx = await paymentsApi.collect({
        business_id: selectedBiz,
        amount,
        category_code: category,
        channel,
        payer_msisdn: phone,
      })
      setResult(tx)
      setFormError("")
      setAmount("")
      setPhone("")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed"
      setFormError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateProfile = () => {
    if (!newProfileName.trim()) {
      setFormError("Profile name is required")
      return
    }
    const profile: PaymentProfile = {
      id: `profile_${Date.now()}`,
      name: newProfileName.trim(),
      payment_method: newProfileMethod as PaymentProfile["payment_method"],
      phone: newProfilePhone.trim() || undefined,
      created_at: new Date().toISOString(),
    }
    const updated = [...profiles, profile]
    saveProfiles(updated)
    setSelectedProfile(profile.id)
    setShowCreateProfile(false)
    setNewProfileName("")
    setNewProfilePhone("")
    setFormError("")
  }

  const handleGenerateLink = () => {
    if (!linkAmount || !selectedProfile) {
      setFormError("Please select a profile and enter amount")
      return
    }
    const profile = profiles.find((p) => p.id === selectedProfile)
    const ref = `LINK-${Date.now()}`
    setResult({
      id: `link_${Date.now()}`,
      reference: ref,
      business: selectedBiz || null,
      customer: null,
      category: "PAYMENT_LINK",
      type: "COLLECTION",
      amount: linkAmount,
      currency: "TZS",
      channel: profile?.payment_method === "CARD" ? "CARD" : "MPESA",
      status: "PENDING",
      selcom_order_id: null,
      selcom_transid: null,
      payment_token: null,
      checkout_url: `https://salamapay.co.tz/pay/${ref}`,
      payer_msisdn: profile?.phone || null,
      failure_reason: null,
      metadata: { profile: profile?.name, description: linkDesc },
      completed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Transaction)
    setFormError("")
  }

  const drawerTitle = useMemo(() => {
    switch (drawerMode) {
      case "receive": return "Receive Payment"
      case "make": return "Make Payment"
      case "qr": return "QR Code Payment"
      case "link": return "Payment Link"
      default: return ""
    }
  }, [drawerMode])

  return (
    <DashboardShell breadcrumb="Payments">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Make and receive payments, generate QR codes and payment links.</p>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[140px] max-w-sm">
          <HugeiconsIcon
            icon={Search01Icon}
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
          />
          <Input
            placeholder="Search by reference, channel, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <HugeiconsIcon icon={FilterIcon} className="size-4" />
          Filter
        </Button>
        <Button size="sm" onClick={() => openDrawer("receive")}>
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          Pay
        </Button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <Card>
          <CardContent className="flex flex-wrap items-end gap-3 sm:gap-4 py-4">
            <div className="flex flex-col gap-1.5 w-full sm:w-auto">
              <Label className="text-xs">Status</Label>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v || "ALL")}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="SUCCESS">Success</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="REVERSED">Reversed</SelectItem>
                  <SelectItem value="EXPIRED">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5 w-full sm:w-auto">
              <Label className="text-xs">Channel</Label>
              <Select value={channelFilter} onValueChange={(v) => setChannelFilter(v || "ALL")}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Channels</SelectItem>
                  <SelectItem value="MPESA">M-Pesa</SelectItem>
                  <SelectItem value="TIGOPESA">Tigo Pesa</SelectItem>
                  <SelectItem value="AIRTEL">Airtel Money</SelectItem>
                  <SelectItem value="HALOPESA">HaloPesa</SelectItem>
                  <SelectItem value="CARD">Card</SelectItem>
                  <SelectItem value="BANK">Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { setStatusFilter("ALL"); setChannelFilter("ALL"); setSearch("") }}>
              Reset
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Summary stats */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 sm:gap-4">
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Payments</p>
              <p className="text-2xl font-bold">{counts.ALL || 0}</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <HugeiconsIcon icon={CreditCardIcon} className="size-5 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm text-muted-foreground">Successful</p>
              <p className="text-2xl font-bold text-green-600">{counts.SUCCESS || 0}</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold text-destructive">{counts.FAILED || 0}</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10">
              <HugeiconsIcon icon={Cancel01Icon} className="size-5 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="size-6" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8 text-destructive">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <HugeiconsIcon icon={CreditCardIcon} className="size-12 text-muted-foreground/30" />
              <p className="text-muted-foreground">No payments found. Click "Pay" to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden sm:table-cell">Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((tx) => {
                  const fee = fees.find((f) => f.channel === tx.channel)
                  const feeAmount = fee
                    ? (Number(tx.amount) * Number(fee.percentage) / 100) + Number(fee.fixed_fee)
                    : 0
                  return (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-xs">{tx.reference}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`flex size-6 items-center justify-center rounded-full ${tx.type === "COLLECTION" ? "bg-green-500/10" : "bg-destructive/10"}`}>
                            <HugeiconsIcon
                              icon={tx.type === "COLLECTION" ? ArrowDown01Icon : ArrowUp01Icon}
                              className={`size-3 ${tx.type === "COLLECTION" ? "text-green-500" : "text-destructive"}`}
                            />
                          </div>
                          <span className="text-xs">{tx.type === "COLLECTION" ? "Received" : "Sent"}</span>
                        </div>
                      </TableCell>
                      <TableCell>{tx.channel}</TableCell>
                      <TableCell className="font-medium whitespace-nowrap">
                        {tx.currency} {Number(tx.amount).toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                        {feeAmount > 0 ? `${tx.currency} ${feeAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_COLORS[tx.status] || "outline"}>
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(tx.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Fees Table */}
      {fees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Channel</TableHead>
                  <TableHead>Fee Type</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Fixed Fee</TableHead>
                  <TableHead>Min Fee</TableHead>
                  <TableHead>Max Fee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fees.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell className="font-medium">{fee.channel}</TableCell>
                    <TableCell className="text-muted-foreground">{fee.fee_type}</TableCell>
                    <TableCell>{fee.percentage}%</TableCell>
                    <TableCell>TZS {Number(fee.fixed_fee).toLocaleString()}</TableCell>
                    <TableCell>TZS {Number(fee.min_fee).toLocaleString()}</TableCell>
                    <TableCell>{fee.max_fee ? `TZS ${Number(fee.max_fee).toLocaleString()}` : "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pay Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} swipeDirection="right">
        <DrawerContent className="sm:max-w-md">
          <DrawerHeader>
            <DrawerTitle>{drawerTitle}</DrawerTitle>
            <DrawerDescription>
              {drawerMode === "receive" && "Collect payment from a customer via mobile money."}
              {drawerMode === "make" && "Send money to a recipient."}
              {drawerMode === "qr" && "Generate a QR code for customers to scan and pay."}
              {drawerMode === "link" && "Create a shareable payment link for your customers."}
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-4 p-4 overflow-y-auto">
            {/* Mode selector tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Button
                variant={drawerMode === "receive" ? "default" : "outline"}
                size="sm"
                onClick={() => { setDrawerMode("receive"); setResult(null); setFormError("") }}
              >
                <HugeiconsIcon icon={ArrowDown01Icon} className="size-4" />
                Receive
              </Button>
              <Button
                variant={drawerMode === "make" ? "default" : "outline"}
                size="sm"
                onClick={() => { setDrawerMode("make"); setResult(null); setFormError("") }}
              >
                <HugeiconsIcon icon={ArrowUp01Icon} className="size-4" />
                Make Payment
              </Button>
              <Button
                variant={drawerMode === "qr" ? "default" : "outline"}
                size="sm"
                onClick={() => { setDrawerMode("qr"); setResult(null); setFormError("") }}
              >
                <HugeiconsIcon icon={QrCode01Icon} className="size-4" />
                QR Code
              </Button>
              <Button
                variant={drawerMode === "link" ? "default" : "outline"}
                size="sm"
                onClick={() => { setDrawerMode("link"); setResult(null); setFormError("") }}
              >
                <HugeiconsIcon icon={Link02Icon} className="size-4" />
                Payment Link
              </Button>
            </div>

            {/* Receive Payment Form */}
            {drawerMode === "receive" && (
              <>
                {businesses.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    You need a business to receive payments.{" "}
                    <a href="/dashboard/onboarding" className="text-primary underline">Add a business first.</a>
                  </p>
                ) : (
                  <>
                    <div className="flex flex-col gap-2">
                      <Label>Business</Label>
                      <Select value={selectedBiz} onValueChange={(v) => setSelectedBiz(v || "")}>
                        <SelectTrigger><SelectValue placeholder="Select business" /></SelectTrigger>
                        <SelectContent>
                          {businesses.map((b) => (
                            <SelectItem key={b.id} value={b.id}>{b.business_name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Payment Category</Label>
                      <Select value={category} onValueChange={(v) => setCategory(v || "")} disabled={categories.length === 0}>
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.code}>{c.name_sw || c.name_en}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Payment Method</Label>
                      <Select value={channel} onValueChange={(v) => setChannel(v || "")}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {channels.map((c) => (
                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Customer Phone Number</Label>
                      <Input placeholder="2557XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Amount (TZS)</Label>
                      <Input type="number" placeholder="50000" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </div>
                  </>
                )}
              </>
            )}

            {/* Make Payment Form */}
            {drawerMode === "make" && (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <HugeiconsIcon icon={CreditCardIcon} className="size-6" />
                    Mobile Money
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <HugeiconsIcon icon={CreditCardIcon} className="size-6" />
                    Bank Transfer
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <HugeiconsIcon icon={CreditCardIcon} className="size-6" />
                    Utility Bills
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <HugeiconsIcon icon={CreditCardIcon} className="size-6" />
                    Government
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground text-center pt-2">
                  Select a payment type to continue.
                </p>
              </div>
            )}

            {/* QR Code Form */}
            {drawerMode === "qr" && (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="flex size-32 items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/30">
                  <HugeiconsIcon icon={QrCode01Icon} className="size-16 text-muted-foreground/50" />
                </div>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  Generate QR codes for your business. Customers scan and pay instantly.
                </p>
                <div className="flex flex-col gap-2 w-full max-w-xs">
                  <Label>Amount (TZS)</Label>
                  <Input type="number" placeholder="50000" />
                </div>
              </div>
            )}

            {/* Payment Link Form */}
            {drawerMode === "link" && (
              <>
                <div className="flex flex-col gap-2">
                  <Label>Payment Profile</Label>
                  {profiles.length === 0 ? (
                    <div className="flex flex-col gap-2 rounded-lg border border-dashed p-4">
                      <p className="text-sm text-muted-foreground text-center">
                        No payment profiles yet. Create one to continue.
                      </p>
                      <Button size="sm" variant="outline" onClick={() => setShowCreateProfile(true)}>
                        <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
                        Create Profile
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Select value={selectedProfile} onValueChange={(v) => setSelectedProfile(v || "")}>
                        <SelectTrigger className="flex-1"><SelectValue placeholder="Select profile" /></SelectTrigger>
                        <SelectContent>
                          {profiles.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name} ({p.payment_method})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="icon" onClick={() => setShowCreateProfile(true)}>
                        <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Amount (TZS)</Label>
                  <Input type="number" placeholder="50000" value={linkAmount} onChange={(e) => setLinkAmount(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Description</Label>
                  <Input placeholder="Invoice #1002" value={linkDesc} onChange={(e) => setLinkDesc(e.target.value)} />
                </div>
              </>
            )}

            {/* Error */}
            {formError && (
              <p className="text-sm text-destructive">{formError}</p>
            )}

            {/* Result */}
            {result && (
              <div className={`flex items-center gap-3 rounded-lg p-4 ${result.status === "SUCCESS" || result.status === "PROCESSING" || result.status === "PENDING" ? "bg-green-500/10" : "bg-destructive/10"}`}>
                <HugeiconsIcon
                  icon={result.status === "FAILED" ? Cancel01Icon : CheckmarkCircle01Icon}
                  className={result.status === "FAILED" ? "text-destructive" : "text-green-500"}
                />
                <div className="text-sm">
                  <p className="font-medium">Reference: {result.reference}</p>
                  <p className="text-muted-foreground">Status: {result.status}</p>
                  {result.checkout_url && (
                    <a href={result.checkout_url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                      Checkout URL
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <DrawerFooter>
            {drawerMode === "receive" && (
              <Button onClick={handleCollect} disabled={submitting || businesses.length === 0}>
                {submitting ? <Spinner className="size-4" /> : <HugeiconsIcon icon={ArrowDown01Icon} className="size-4" />}
                Collect Payment
              </Button>
            )}
            {drawerMode === "qr" && (
              <Button>
                <HugeiconsIcon icon={QrCode01Icon} className="size-4" />
                Generate QR Code
              </Button>
            )}
            {drawerMode === "link" && (
              <Button onClick={handleGenerateLink} disabled={!selectedProfile || !linkAmount}>
                <HugeiconsIcon icon={Link02Icon} className="size-4" />
                Generate Payment Link
              </Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Create Payment Profile Dialog */}
      <Dialog open={showCreateProfile} onOpenChange={setShowCreateProfile}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Payment Profile</DialogTitle>
            <DialogDescription>
              Create a profile to use with payment links. Choose a name, payment method, and optional phone number.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label>Profile Name</Label>
              <Input
                placeholder="e.g. Main Shop, Online Store"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Payment Method</Label>
              <Select value={newProfileMethod} onValueChange={(v) => setNewProfileMethod(v || "MOBILE_MONEY")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MOBILE_MONEY">Mobile Money (Phone)</SelectItem>
                  <SelectItem value="CARD">Card</SelectItem>
                  <SelectItem value="QR">QR Code</SelectItem>
                  <SelectItem value="BANK">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(newProfileMethod === "MOBILE_MONEY" || newProfileMethod === "QR") && (
              <div className="flex flex-col gap-2">
                <Label>Phone Number (optional)</Label>
                <Input
                  placeholder="2557XXXXXXXX"
                  value={newProfilePhone}
                  onChange={(e) => setNewProfilePhone(e.target.value)}
                />
              </div>
            )}
            {formError && <p className="text-sm text-destructive">{formError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateProfile(false)}>Cancel</Button>
            <Button onClick={handleCreateProfile}>
              <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
              Create Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
