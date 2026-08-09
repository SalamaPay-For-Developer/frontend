"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/lib/auth-context"
import { paymentsApi } from "@/lib/api"
import type { PaymentCategory, Transaction } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CreditCardIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  QrCode01Icon,
  Link02Icon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"

export default function PaymentsPage() {
  const { activeBusiness, businesses } = useAuth()
  const [categories, setCategories] = useState<PaymentCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Make Payment form
  const [selectedBiz, setSelectedBiz] = useState(activeBusiness?.id || "")
  const [amount, setAmount] = useState("")
  const [phone, setPhone] = useState("")
  const [channel, setChannel] = useState("MPESA")
  const [category, setCategory] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<Transaction | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await paymentsApi.categories()
        setCategories(data)
        if (data.length > 0) setCategory(data[0].code)
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    if (activeBusiness) setSelectedBiz(activeBusiness.id)
  }, [activeBusiness])

  const handleCollect = async () => {
    if (!selectedBiz || !amount || !phone || !category) {
      setError("Please fill all fields")
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
      setError("")
      setAmount("")
      setPhone("")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed"
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const channels = [
    { value: "MPESA", label: "M-Pesa" },
    { value: "TIGOPESA", label: "Tigo Pesa" },
    { value: "AIRTEL", label: "Airtel Money" },
    { value: "HALOPESA", label: "HaloPesa" },
  ]

  return (
    <DashboardShell breadcrumb="Payments">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">Make and receive payments through Salamapay.</p>
      </div>

      <Tabs defaultValue="receive">
        <TabsList>
          <TabsTrigger value="receive">
            <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 mr-2" />
            Receive Payment
          </TabsTrigger>
          <TabsTrigger value="make">
            <HugeiconsIcon icon={ArrowUp01Icon} className="size-4 mr-2" />
            Make Payment
          </TabsTrigger>
          <TabsTrigger value="qr">
            <HugeiconsIcon icon={QrCode01Icon} className="size-4 mr-2" />
            QR Payments
          </TabsTrigger>
          <TabsTrigger value="links">
            <HugeiconsIcon icon={Link02Icon} className="size-4 mr-2" />
            Payment Links
          </TabsTrigger>
        </TabsList>

        {/* Receive Payment */}
        <TabsContent value="receive">
          <Card>
            <CardHeader>
              <CardTitle>Receive Payment</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 max-w-md">
              {businesses.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  You need a business to receive payments.{" "}
                  <a href="/dashboard/onboarding" className="text-primary underline">Add a business first.</a>
                </p>
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="biz">Business</Label>
                    <Select value={selectedBiz} onValueChange={(v) => setSelectedBiz(v || "")}>
                      <SelectTrigger id="biz">
                        <SelectValue placeholder="Select business" />
                      </SelectTrigger>
                      <SelectContent>
                        {businesses.map((b) => (
                          <SelectItem key={b.id} value={b.id}>
                            {b.business_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="cat">Payment Category</Label>
                    <Select value={category} onValueChange={(v) => setCategory(v || "")} disabled={isLoading}>
                      <SelectTrigger id="cat">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.code}>
                            {c.name_sw || c.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="channel">Payment Method</Label>
                    <Select value={channel} onValueChange={(v) => setChannel(v || "")}>
                      <SelectTrigger id="channel">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {channels.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="phone">Customer Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="2557XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="amount">Amount (TZS)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="50000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  <Button onClick={handleCollect} disabled={submitting}>
                    {submitting ? <Spinner className="size-4" /> : <HugeiconsIcon icon={ArrowDown01Icon} className="size-4" />}
                    Collect Payment
                  </Button>

                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}

                  {result && (
                    <div className={`flex items-center gap-3 rounded-lg p-4 ${result.status === "SUCCESS" || result.status === "PROCESSING" ? "bg-green-500/10" : "bg-destructive/10"}`}>
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
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Make Payment */}
        <TabsContent value="make">
          <Card>
            <CardHeader>
              <CardTitle>Make Payment</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 max-w-md">
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
              <p className="text-sm text-muted-foreground text-center pt-4">
                Select a payment type to continue.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* QR Payments */}
        <TabsContent value="qr">
          <Card>
            <CardHeader>
              <CardTitle>QR Payments</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 py-8">
              <div className="flex size-32 items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/30">
                <HugeiconsIcon icon={QrCode01Icon} className="size-16 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Generate QR codes for your business to accept payments. Customers scan and pay instantly.
              </p>
              <Button>
                <HugeiconsIcon icon={QrCode01Icon} className="size-4" />
                Generate QR Code
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Links */}
        <TabsContent value="links">
          <Card>
            <CardHeader>
              <CardTitle>Payment Links</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 max-w-md">
              <div className="flex flex-col gap-2">
                <Label htmlFor="link-amount">Amount (TZS)</Label>
                <Input id="link-amount" type="number" placeholder="50000" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="link-desc">Description</Label>
                <Input id="link-desc" placeholder="Invoice #1002" />
              </div>
              <Button>
                <HugeiconsIcon icon={Link02Icon} className="size-4" />
                Generate Payment Link
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
