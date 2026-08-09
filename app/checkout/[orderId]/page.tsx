"use client"

import { useState, useEffect, use } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Separator } from "@/components/ui/separator"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CreditCardIcon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  Wallet01Icon,
  BankIcon,
  ArrowLeft01Icon,
  ShieldKeyIcon,
} from "@hugeicons/core-free-icons"
import Link from "next/link"

interface CheckoutData {
  order_id: string
  amount: string
  currency: string
  description: string | null
  customer_name: string | null
  business_name: string
  payment_methods: string[]
  status: string
  appearance_config: {
    show_logo?: boolean
    show_amount?: boolean
    show_description?: boolean
    theme?: string
    brand_color?: string
  }
}

export default function CheckoutPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params)
  const [checkout, setCheckout] = useState<CheckoutData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedMethod, setSelectedMethod] = useState("")
  const [phone, setPhone] = useState("")
  const [paying, setPaying] = useState(false)
  const [payResult, setPayResult] = useState<"success" | "failed" | null>(null)

  useEffect(() => {
    const fetchCheckout = async () => {
      try {
        // TODO: Call backend to get checkout details
        await new Promise((r) => setTimeout(r, 500))
        setCheckout({
          order_id: orderId,
          amount: "50000",
          currency: "TZS",
          description: "Hotel Booking - Deluxe Room",
          customer_name: "John Doe",
          business_name: "SalamaPay Demo",
          payment_methods: ["MOBILE_MONEY", "CARD", "BANK"],
          status: "PENDING",
          appearance_config: {
            show_logo: true,
            show_amount: true,
            show_description: true,
            theme: "LIGHT",
            brand_color: "#10B981",
          },
        })
      } catch {
        setError("Failed to load checkout")
      } finally {
        setIsLoading(false)
      }
    }
    fetchCheckout()
  }, [orderId])

  const handlePay = async () => {
    setPaying(true)
    setPayResult(null)
    try {
      // TODO: Call backend to process payment
      await new Promise((r) => setTimeout(r, 1500))
      setPayResult("success")
    } catch {
      setPayResult("failed")
    } finally {
      setPaying(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="size-8" />
      </div>
    )
  }

  if (error || !checkout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center py-12 gap-4">
            <HugeiconsIcon icon={Cancel01Icon} className="size-12 text-destructive" />
            <p className="text-muted-foreground">{error || "Checkout not found"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (payResult === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center py-12 gap-4">
            <div className="rounded-full bg-green-500/10 p-4">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-12 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold">Payment Successful</h2>
            <p className="text-muted-foreground text-center">
              Your payment of TZS {Number(checkout.amount).toLocaleString()} to {checkout.business_name} has been completed.
            </p>
            <Badge variant="outline" className="font-mono">{checkout.order_id}</Badge>
          </CardContent>
        </Card>
      </div>
    )
  }

  const brandColor = checkout.appearance_config?.brand_color || "#10B981"
  const methodIcons: Record<string, typeof CreditCardIcon> = {
    MOBILE_MONEY: Wallet01Icon,
    CARD: CreditCardIcon,
    BANK: BankIcon,
  }
  const methodLabels: Record<string, string> = {
    MOBILE_MONEY: "Mobile Money",
    CARD: "Card",
    BANK: "Bank Transfer",
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        {checkout.appearance_config?.show_logo && (
          <div className="flex items-center justify-center mb-6">
            <div
              className="flex items-center gap-2 rounded-lg px-4 py-2"
              style={{ backgroundColor: `${brandColor}15` }}
            >
              <div
                className="flex size-8 items-center justify-center rounded-lg text-white font-bold text-sm"
                style={{ backgroundColor: brandColor }}
              >
                {checkout.business_name.charAt(0)}
              </div>
              <span className="font-semibold">{checkout.business_name}</span>
            </div>
          </div>
        )}

        <Card className="shadow-lg">
          <CardContent className="flex flex-col gap-6 p-6">
            {/* Amount */}
            {checkout.appearance_config?.show_amount && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Amount Due</p>
                <p className="text-3xl font-bold mt-1">
                  {checkout.currency} {Number(checkout.amount).toLocaleString()}
                </p>
              </div>
            )}

            {/* Description */}
            {checkout.appearance_config?.show_description && checkout.description && (
              <>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground">Description</p>
                  <p className="text-sm font-medium">{checkout.description}</p>
                </div>
              </>
            )}

            <Separator />

            {/* Payment Methods */}
            <div className="flex flex-col gap-3">
              <Label>Select Payment Method</Label>
              <div className="grid gap-2">
                {checkout.payment_methods.map((method) => (
                  <button
                    key={method}
                    onClick={() => setSelectedMethod(method)}
                    className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                      selectedMethod === method ? "border-2" : "border-dashed hover:bg-accent"
                    }`}
                    style={selectedMethod === method ? { borderColor: brandColor, backgroundColor: `${brandColor}10` } : {}}
                  >
                    <HugeiconsIcon icon={methodIcons[method] || CreditCardIcon} className="size-5" />
                    <span className="text-sm font-medium flex-1 text-left">{methodLabels[method] || method}</span>
                    {selectedMethod === method && (
                      <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-5" style={{ color: brandColor }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Details based on method */}
            {selectedMethod === "MOBILE_MONEY" && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Mobile Money Number</Label>
                <Input
                  id="phone"
                  placeholder="2557XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            )}

            {selectedMethod === "CARD" && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" type="password" />
                  </div>
                </div>
              </div>
            )}

            {/* Pay Button */}
            <Button
              size="lg"
              disabled={!selectedMethod || paying}
              onClick={handlePay}
              style={{ backgroundColor: brandColor }}
              className="w-full"
            >
              {paying ? (
                <><Spinner className="size-4" /> Processing...</>
              ) : (
                <>Pay {checkout.currency} {Number(checkout.amount).toLocaleString()}</>
              )}
            </Button>

            {payResult === "failed" && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive text-center">
                Payment failed. Please try again.
              </div>
            )}

            {/* Security */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <HugeiconsIcon icon={ShieldKeyIcon} className="size-3" />
              Secured by SalamaPay
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-4">
          <Link href="/" className="text-xs text-muted-foreground flex items-center gap-1 hover:underline">
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3" />
            Cancel payment
          </Link>
        </div>
      </div>
    </div>
  )
}
