"use client"

import { useState } from "react"
import { AdminShell } from "@/components/admin-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Separator } from "@/components/ui/separator"
import { HugeiconsIcon } from "@hugeicons/react"
import { AiPhoneIcon, Search01Icon, UserCircleIcon } from "@hugeicons/core-free-icons"

export default function AdminCallCenterPage() {
  const [phone, setPhone] = useState("")
  const [searching, setSearching] = useState(false)
  const [result, setResult] = useState<{ name: string; phone: string; transactions: { reference: string; amount: string; status: string }[] } | null>(null)

  const handleSearch = async () => {
    if (!phone) return
    setSearching(true)
    setResult(null)
    try {
      // TODO: Call backend to search user by phone
      await new Promise((r) => setTimeout(r, 800))
      setResult({
        name: "John Doe",
        phone,
        transactions: [
          { reference: "SP-001", amount: "50000", status: "SUCCESS" },
          { reference: "SP-002", amount: "25000", status: "PENDING" },
        ],
      })
    } catch {
      // ignore
    } finally {
      setSearching(false)
    }
  }

  return (
    <AdminShell breadcrumb="Call Center">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Call Center</h1>
        <p className="text-muted-foreground">Search customers by phone and view their transaction history.</p>
      </div>

      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <HugeiconsIcon icon={AiPhoneIcon} className="size-5" />
            </div>
            <div className="flex-1">
              <Label htmlFor="phone-search">Search by Phone Number</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="phone-search"
                  placeholder="2557XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={searching}>
                  {searching ? <Spinner className="size-4" /> : <HugeiconsIcon icon={Search01Icon} className="size-4" />}
                  Search
                </Button>
              </div>
            </div>
          </div>

          {result && (
            <>
              <Separator />
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <HugeiconsIcon icon={UserCircleIcon} className="size-6" />
                </div>
                <div>
                  <p className="font-semibold">{result.name}</p>
                  <p className="text-sm text-muted-foreground">{result.phone}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Recent Transactions</p>
                <div className="flex flex-col gap-2">
                  {result.transactions.map((t) => (
                    <div key={t.reference} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex flex-col">
                        <span className="font-mono text-sm">{t.reference}</span>
                        <span className="text-xs text-muted-foreground">Provider: Selcom</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">TZS {Number(t.amount).toLocaleString()}</span>
                        <Badge variant={t.status === "SUCCESS" ? "default" : t.status === "FAILED" ? "destructive" : "secondary"}>
                          {t.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />
              <Button variant="outline">Create Support Ticket</Button>
            </>
          )}

          {!result && !searching && (
            <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
              Enter a phone number to search for a customer.
            </div>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  )
}
