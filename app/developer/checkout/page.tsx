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
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { developerApi } from "@/lib/api"
import type { CheckoutSession } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CreditCardIcon,
  PlusSignIcon,
  Copy01Icon,
  CheckmarkCircle01Icon,
  ArrowDown01Icon,
  CheckmarkBadgeIcon,
} from "@hugeicons/core-free-icons"

const PAYMENT_METHODS = [
  { value: "MOBILE_MONEY", label: "Mobile Money" },
  { value: "CARD", label: "Card" },
  { value: "BANK", label: "Bank" },
]

export default function CheckoutBuilderPage() {
  const [checkouts, setCheckouts] = useState<CheckoutSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Form state
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("TZS")
  const [description, setDescription] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [selectedMethods, setSelectedMethods] = useState<string[]>(["MOBILE_MONEY", "CARD", "BANK"])
  const [successUrl, setSuccessUrl] = useState("")
  const [cancelUrl, setCancelUrl] = useState("")

  // Customization
  const [showLogo, setShowLogo] = useState(true)
  const [showAmount, setShowAmount] = useState(true)
  const [showDescription, setShowDescription] = useState(true)
  const [theme, setTheme] = useState("LIGHT")
  const [brandColor, setBrandColor] = useState("#10B981")

  useEffect(() => {
    const fetchCheckouts = async () => {
      try {
        const data = await developerApi.checkouts()
        setCheckouts(data)
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }
    fetchCheckouts()
  }, [])

  const toggleMethod = (method: string) => {
    if (selectedMethods.includes(method)) {
      setSelectedMethods(selectedMethods.filter((m) => m !== method))
    } else {
      setSelectedMethods([...selectedMethods, method])
    }
  }

  const handleCreate = async () => {
    if (!amount) {
      setError("Amount is required")
      return
    }
    setSubmitting(true)
    setError("")
    try {
      const checkout = await developerApi.createCheckout({
        amount,
        currency,
        description: description || undefined,
        customer_name: customerName || undefined,
        customer_phone: customerPhone || undefined,
        customer_email: customerEmail || undefined,
        payment_methods: selectedMethods,
        success_url: successUrl || undefined,
        cancel_url: cancelUrl || undefined,
        appearance_config: {
          show_logo: showLogo,
          show_amount: showAmount,
          show_description: showDescription,
          theme,
          brand_color: brandColor,
        },
      })
      setCheckouts([checkout, ...checkouts])
      setShowCreate(false)
      setAmount("")
      setDescription("")
      setCustomerName("")
      setCustomerPhone("")
      setCustomerEmail("")
      setSuccessUrl("")
      setCancelUrl("")
    } catch {
      setError("Failed to create checkout")
    } finally {
      setSubmitting(false)
    }
  }

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <DeveloperShell breadcrumb="Checkout">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Checkout Builder</h1>
          <p className="text-muted-foreground">Create payment checkout sessions for your customers.</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          Create Checkout
        </Button>
      </div>

      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardHeader><CardTitle>Checkout Sessions</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8"><Spinner className="size-6" /></div>
          ) : checkouts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <HugeiconsIcon icon={CreditCardIcon} className="size-12 text-muted-foreground" />
              <p className="text-muted-foreground">No checkout sessions yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Methods</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Checkout URL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checkouts.map((co) => (
                  <TableRow key={co.id}>
                    <TableCell className="font-mono text-sm">{co.order_id}</TableCell>
                    <TableCell>TZS {Number(co.amount).toLocaleString()}</TableCell>
                    <TableCell className="text-sm">{co.customer_name || "—"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {co.payment_methods.map((m) => (
                          <Badge key={m} variant="outline" className="text-xs">{m}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={co.status === "SUCCESS" ? "default" : co.status === "PENDING" ? "secondary" : "destructive"}>
                        {co.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono truncate max-w-[200px]">{co.checkout_url}</code>
                        <Button size="sm" variant="ghost" onClick={() => copyUrl(co.id, co.checkout_url)}>
                          <HugeiconsIcon icon={copiedId === co.id ? CheckmarkCircle01Icon : Copy01Icon} className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {showCreate && (
        <div className="flex flex-col gap-6">
          <Card className="border-none shadow-sm dark:bg-muted/50">
            <CardHeader><CardTitle>Create Checkout</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="amount">Amount (TZS)</Label>
                  <Input id="amount" type="number" placeholder="50000" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Hotel Booking" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cust-name">Customer Name</Label>
                  <Input id="cust-name" placeholder="John Doe" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cust-phone">Customer Phone</Label>
                  <Input id="cust-phone" placeholder="2557XXXXXXXX" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cust-email">Customer Email</Label>
                  <Input id="cust-email" type="email" placeholder="john@example.com" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
                </div>
              </div>
              <Separator />
              <div className="flex flex-col gap-2">
                <Label>Payment Methods</Label>
                <div className="flex gap-3">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => toggleMethod(m.value)}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ${
                        selectedMethods.includes(m.value) ? "border-primary bg-primary/5" : "border-dashed"
                      }`}
                    >
                      <HugeiconsIcon
                        icon={selectedMethods.includes(m.value) ? CheckmarkCircle01Icon : CreditCardIcon}
                        className={`size-4 ${selectedMethods.includes(m.value) ? "text-primary" : "text-muted-foreground"}`}
                      />
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="success-url">Success URL</Label>
                  <Input id="success-url" placeholder="https://example.com/success" value={successUrl} onChange={(e) => setSuccessUrl(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cancel-url">Cancel URL</Label>
                  <Input id="cancel-url" placeholder="https://example.com/cancel" value={cancelUrl} onChange={(e) => setCancelUrl(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm dark:bg-muted/50">
            <CardHeader><CardTitle>Checkout Appearance</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>Theme</Label>
                  <Select value={theme} onValueChange={(v) => setTheme(v || "LIGHT")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LIGHT">Light</SelectItem>
                      <SelectItem value="DARK">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="brand-color">Brand Color</Label>
                  <div className="flex gap-2">
                    <Input id="brand-color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} />
                    <input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="size-10 rounded border" />
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex flex-col gap-3">
                <Label>Display Options</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show Business Logo</span>
                  <Switch checked={showLogo} onCheckedChange={setShowLogo} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show Amount</span>
                  <Switch checked={showAmount} onCheckedChange={setShowAmount} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show Description</span>
                  <Switch checked={showDescription} onCheckedChange={setShowDescription} />
                </div>
              </div>
            </CardContent>
          </Card>

          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-3">
            <Button onClick={handleCreate} disabled={submitting}>
              {submitting ? <Spinner className="size-4" /> : <HugeiconsIcon icon={CheckmarkBadgeIcon} className="size-4" />}
              Create Checkout
            </Button>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
          </div>
        </div>
      )}
    </DeveloperShell>
  )
}
