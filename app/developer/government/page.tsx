"use client"

import { DeveloperShell } from "@/components/developer-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { HugeiconsIcon } from "@hugeicons/react"
import { Store04Icon, Search01Icon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons"
import { useState } from "react"

export default function GovernmentPage() {
  const [controlNumber, setControlNumber] = useState("")
  const [lookupResult, setLookupResult] = useState<{ payer_name: string; amount: string; service: string; reference: string } | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
  const [payResult, setPayResult] = useState<string | null>(null)

  const handleVerify = async () => {
    if (!controlNumber) return
    setIsVerifying(true)
    setLookupResult(null)
    setPayResult(null)
    try {
      // TODO: Call backend government payment lookup
      await new Promise((r) => setTimeout(r, 800))
      setLookupResult({
        payer_name: "EZRA TECHNOLOGIES LTD",
        amount: "250000",
        service: "Business License Renewal",
        reference: "GOV-2024-001",
      })
    } catch {
      // ignore
    } finally {
      setIsVerifying(false)
    }
  }

  const handlePay = async () => {
    if (!lookupResult) return
    setIsPaying(true)
    setPayResult(null)
    try {
      // TODO: Call backend government payment
      await new Promise((r) => setTimeout(r, 800))
      setPayResult("Payment successful! Control number confirmed. Reference: GOV-SP-001")
    } catch {
      setPayResult("Payment failed. Please try again.")
    } finally {
      setIsPaying(false)
    }
  }

  return (
    <DeveloperShell breadcrumb="Government Payments">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Government Payments</h1>
        <p className="text-muted-foreground">Pay government bills using Control Numbers (GePG).</p>
      </div>

      <Card className="border-none shadow-sm dark:bg-muted/50 max-w-2xl mx-auto w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={Store04Icon} className="size-5" />
            Control Number Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="control-number">Control Number</Label>
            <div className="flex gap-2">
              <Input
                id="control-number"
                placeholder="e.g. 99123456789012"
                value={controlNumber}
                onChange={(e) => setControlNumber(e.target.value)}
              />
              <Button onClick={handleVerify} disabled={!controlNumber || isVerifying}>
                <HugeiconsIcon icon={Search01Icon} className="size-4" />
                {isVerifying ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </div>

          {lookupResult && (
            <>
              <Separator />
              <div className="rounded-lg border p-4 flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payer Name</span>
                  <span className="font-medium">{lookupResult.payer_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium">{lookupResult.service}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Reference</span>
                  <span className="font-mono text-xs">{lookupResult.reference}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-bold text-lg">TZS {Number(lookupResult.amount).toLocaleString()}</span>
                </div>
              </div>
              <Button onClick={handlePay} disabled={isPaying} size="lg">
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

          {!lookupResult && !payResult && (
            <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
              Enter a control number and click Verify to see payment details.
            </div>
          )}
        </CardContent>
      </Card>
    </DeveloperShell>
  )
}
