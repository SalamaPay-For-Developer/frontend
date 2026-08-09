"use client"

import { DeveloperShell } from "@/components/developer-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HugeiconsIcon } from "@hugeicons/react"
import { SentIcon, Search01Icon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons"
import { useState } from "react"

const UTILITIES = [
  { code: "LUKU", label: "LUKU (Electricity)" },
  { code: "DAWASA", label: "DAWASA (Water)" },
  { code: "DSTV", label: "DSTV (TV)" },
  { code: "AZAM", label: "Azam TV" },
  { code: "TIGO", label: "Tigo Pesa" },
  { code: "VODACOM", label: "Vodacom M-Pesa" },
  { code: "AIRTEL", label: "Airtel Money" },
  { code: "HALOTEL", label: "Halotel" },
]

export default function UtilitiesPage() {
  const [selectedUtility, setSelectedUtility] = useState("")
  const [customerRef, setCustomerRef] = useState("")
  const [lookupResult, setLookupResult] = useState<{ customer_name: string; amount: string } | null>(null)
  const [isLooking, setIsLooking] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
  const [payResult, setPayResult] = useState<string | null>(null)

  const handleLookup = async () => {
    if (!selectedUtility || !customerRef) return
    setIsLooking(true)
    setLookupResult(null)
    setPayResult(null)
    try {
      // TODO: Call backend utility lookup
      await new Promise((r) => setTimeout(r, 800))
      setLookupResult({ customer_name: "JOHN DOE", amount: "15000" })
    } catch {
      // ignore
    } finally {
      setIsLooking(false)
    }
  }

  const handlePay = async () => {
    if (!lookupResult) return
    setIsPaying(true)
    setPayResult(null)
    try {
      // TODO: Call backend utility payment
      await new Promise((r) => setTimeout(r, 800))
      setPayResult("Payment successful! Reference: UTILITY-SP-001")
    } catch {
      setPayResult("Payment failed. Please try again.")
    } finally {
      setIsPaying(false)
    }
  }

  return (
    <DeveloperShell breadcrumb="Utility Payments">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Utility Payments</h1>
        <p className="text-muted-foreground">Pay utilities via Selcom: LUKU, Water, TV, Telecom, and more.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Utility Selection */}
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardHeader><CardTitle>Select Utility</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {UTILITIES.map((util) => (
                <button
                  key={util.code}
                  onClick={() => { setSelectedUtility(util.code); setLookupResult(null); setPayResult(null) }}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors hover:bg-accent ${
                    selectedUtility === util.code ? "border-primary bg-primary/5" : "border-dashed"
                  }`}
                >
                  <HugeiconsIcon icon={SentIcon} className="size-6 text-muted-foreground" />
                  <span className="text-xs font-medium">{util.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Flow */}
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardHeader><CardTitle>Payment</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Customer Reference</Label>
              <Input
                placeholder="e.g. 123456789"
                value={customerRef}
                onChange={(e) => setCustomerRef(e.target.value)}
                disabled={!selectedUtility}
              />
            </div>
            <Button onClick={handleLookup} disabled={!selectedUtility || !customerRef || isLooking}>
              <HugeiconsIcon icon={Search01Icon} className="size-4" />
              {isLooking ? "Looking up..." : "Lookup"}
            </Button>

            {lookupResult && (
              <>
                <Separator />
                <div className="rounded-lg border p-3 flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Customer Name</span>
                    <span className="font-medium">{lookupResult.customer_name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount Due</span>
                    <span className="font-medium">TZS {Number(lookupResult.amount).toLocaleString()}</span>
                  </div>
                </div>
                <Button onClick={handlePay} disabled={isPaying}>
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" />
                  {isPaying ? "Processing..." : `Pay TZS ${Number(lookupResult.amount).toLocaleString()}`}
                </Button>
              </>
            )}

            {payResult && (
              <div className={`rounded-md p-3 text-sm ${payResult.includes("successful") ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"}`}>
                {payResult}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DeveloperShell>
  )
}
