"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle01Icon,
  Cancel01Icon,
  ShieldKeyIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

interface CheckoutData {
  order_id: string
  short_code: string | null
  amount: string | null
  currency: string
  description: string | null
  customer_name: string | null
  customer_phone: string | null
  customer_email: string | null
  payment_methods: string[]
  allow_custom_amount: boolean
  min_amount: string | null
  max_amount: string | null
  status: string
  merchant_name: string
  merchant_logo: string | null
  paid_at: string | null
}

const paymentChannels = [
  { code: "MPESA", label: "M-Pesa", color: "bg-green-500" },
  { code: "TIGOPESA", label: "Tigo Pesa", color: "bg-blue-500" },
  { code: "AIRTEL", label: "Airtel Money", color: "bg-red-500" },
  { code: "HALOPESA", label: "Halo Pesa", color: "bg-orange-500" },
]

export default function CheckoutPage() {
  const params = useParams()
  const code = params.code as string

  const [checkout, setCheckout] = useState<CheckoutData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedChannel, setSelectedChannel] = useState("")
  const [phone, setPhone] = useState("")
  const [customAmount, setCustomAmount] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle")

  useEffect(() => {
    const fetchCheckout = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/developer/checkout/${code}/`)
        const data = await res.json()
        if (data.status === "success") {
          setCheckout(data.data)
          if (data.data.payment_methods?.length) {
            const first = data.data.payment_methods.find((m: string) =>
              paymentChannels.some((c) => c.code === m)
            )
            if (first) setSelectedChannel(first)
          }
        } else {
          setError(data.message || "Checkout session not found")
        }
      } catch {
        setError("Failed to load checkout. Please check your link.")
      } finally {
        setLoading(false)
      }
    }
    fetchCheckout()
  }, [code])

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkout) return
    setSubmitting(true)
    setPaymentStatus("processing")

    try {
      const amount = checkout.allow_custom_amount ? customAmount : checkout.amount
      const res = await fetch(`${API_BASE_URL}/payments/transactions/collect/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: checkout.order_id,
          amount: amount,
          category_code: "GENERAL",
          channel: selectedChannel,
          payer_msisdn: phone,
        }),
      })
      const data = await res.json()
      if (data.status === "success") {
        setPaymentStatus("success")
      } else {
        setPaymentStatus("failed")
        setError(data.message || "Payment failed. Please try again.")
      }
    } catch {
      setPaymentStatus("failed")
      setError("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (error && !checkout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
        <div className="max-w-md w-full rounded-2xl border border-border bg-background p-8 text-center">
          <div className="flex size-16 mx-auto items-center justify-center rounded-full bg-destructive/10 mb-4">
            <HugeiconsIcon icon={Cancel01Icon} className="size-8 text-destructive" />
          </div>
          <h1 className="text-xl font-bold mb-2">Checkout Unavailable</h1>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
        <div className="max-w-md w-full rounded-2xl border border-border bg-background p-8 text-center">
          <div className="flex size-20 mx-auto items-center justify-center rounded-full bg-green-500/10 mb-6 animate-in zoom-in duration-500">
            <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Your payment of {checkout?.currency} {Number(checkout?.amount || customAmount).toLocaleString()} has been received.
          </p>
          <div className="rounded-xl bg-muted/30 p-4 text-left text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reference</span>
              <span className="font-mono text-xs">{checkout?.order_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Merchant</span>
              <span className="font-medium">{checkout?.merchant_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-bold">{checkout?.currency} {Number(checkout?.amount || customAmount).toLocaleString()}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            You can close this page. A receipt has been sent to your phone.
          </p>
        </div>
      </div>
    )
  }

  if (checkout?.status === "SUCCESS" || checkout?.status === "COMPLETED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
        <div className="max-w-md w-full rounded-2xl border border-border bg-background p-8 text-center">
          <div className="flex size-20 mx-auto items-center justify-center rounded-full bg-green-500/10 mb-6">
            <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Already Paid</h1>
          <p className="text-sm text-muted-foreground">
            This payment link has already been completed.
          </p>
        </div>
      </div>
    )
  }

  const displayAmount = checkout?.allow_custom_amount ? customAmount : checkout?.amount

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/salamapaylogo.png" alt="Salamapay" className="size-7 object-contain" />
            <span className="font-bold text-sm">Salamapay</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <HugeiconsIcon icon={ShieldKeyIcon} className="size-3" />
            Secure Payment
          </div>
        </div>
      </header>

      {/* Checkout body */}
      <main className="flex-1 flex items-start justify-center py-8 px-4">
        <div className="max-w-md w-full">
          {/* Merchant card */}
          <div className="rounded-2xl border border-border bg-background p-6 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                <img src="/salamapaylogo.png" alt="Merchant" className="size-5 object-contain" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Paying to</p>
                <p className="font-bold text-sm">{checkout?.merchant_name}</p>
              </div>
            </div>
            {checkout?.description && (
              <p className="text-sm text-muted-foreground mb-4">{checkout.description}</p>
            )}
            <div className="rounded-xl bg-muted/30 p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Amount</p>
              {checkout?.allow_custom_amount ? (
                <div className="flex items-center justify-center gap-1">
                  <span className="text-sm text-muted-foreground">{checkout.currency}</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-32 text-3xl font-black text-center bg-transparent outline-none border-b-2 border-border focus:border-primary transition-colors"
                  />
                </div>
              ) : (
                <p className="text-3xl font-black">
                  {checkout?.currency} {Number(checkout?.amount).toLocaleString()}
                </p>
              )}
              {checkout?.allow_custom_amount && checkout.min_amount && (
                <p className="text-xs text-muted-foreground mt-1">
                  Min: {checkout.currency} {Number(checkout.min_amount).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {/* Payment form */}
          <form onSubmit={handlePay} className="rounded-2xl border border-border bg-background p-6 space-y-5">
            {/* Channel selection */}
            <div>
              <p className="text-sm font-semibold mb-3">Select payment method</p>
              <div className="grid grid-cols-2 gap-2">
                {paymentChannels
                  .filter((ch) => checkout?.payment_methods?.includes(ch.code))
                  .map((ch) => (
                    <button
                      key={ch.code}
                      type="button"
                      onClick={() => setSelectedChannel(ch.code)}
                      className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 transition-all text-left ${
                        selectedChannel === ch.code
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <div className={`size-3 rounded-full ${ch.color}`} />
                      <span className="text-sm font-medium">{ch.label}</span>
                      {selectedChannel === ch.code && (
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4 text-primary ml-auto" />
                      )}
                    </button>
                  ))}
              </div>
            </div>

            {/* Phone input */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Mobile number</label>
              <input
                type="tel"
                required
                placeholder="0712 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-12 rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary/60 transition-colors"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                You&apos;ll receive a payment prompt on this number.
              </p>
            </div>

            {/* Error */}
            {paymentStatus === "failed" && error && (
              <div className="rounded-xl bg-destructive/5 border border-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || !selectedChannel || !phone || (checkout?.allow_custom_amount && !customAmount)}
              className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Pay {checkout?.currency} {displayAmount ? Number(displayAmount).toLocaleString() : ""}
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                </>
              )}
            </button>
          </form>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <HugeiconsIcon icon={ShieldKeyIcon} className="size-3" />
              256-bit SSL
            </div>
            <div className="size-1 rounded-full bg-muted-foreground/30" />
            <span>Powered by Selcom</span>
            <div className="size-1 rounded-full bg-muted-foreground/30" />
            <span>Bank of Tanzania Licensed</span>
          </div>
        </div>
      </main>
    </div>
  )
}
