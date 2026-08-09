"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { paymentsApi, walletsApi } from "@/lib/api"
import type { Transaction, Wallet, TransactionSummary } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Store04Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  Wallet01Icon,
  CheckmarkBadgeIcon,
  UserGroupIcon,
  BankIcon,
} from "@hugeicons/core-free-icons"
import Link from "next/link"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

export default function BusinessDashboardPage() {
  const { activeBusiness } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [summary, setSummary] = useState<TransactionSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txData, walletData, summaryData] = await Promise.all([
          paymentsApi.transactions().catch(() => []),
          walletsApi.list().catch(() => []),
          paymentsApi.summary().catch(() => null),
        ])
        setTransactions(txData)
        setWallets(walletData)
        if (summaryData) setSummary(summaryData)
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (!activeBusiness) {
    return (
      <DashboardShell breadcrumb="Business Dashboard">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
            <HugeiconsIcon icon={Store04Icon} className="size-12 text-muted-foreground" />
            <p className="text-muted-foreground">Select or create a business to view its dashboard.</p>
            <Button render={<Link href="/dashboard/onboarding" />}>Add Business</Button>
          </CardContent>
        </Card>
      </DashboardShell>
    )
  }

  const businessWallets = wallets.filter((w) => w.business === activeBusiness.id)
  const businessTx = transactions.filter((t) => t.business === activeBusiness.id)
  const balance = businessWallets.reduce((sum, w) => sum + Number(w.balance), 0)
  const revenue = summary ? Number(summary.total_income) : businessTx.filter((t) => t.type === "COLLECTION" && t.status === "SUCCESS").reduce((s, t) => s + Number(t.amount), 0)
  const expenses = summary ? Number(summary.total_expense) : businessTx.filter((t) => t.type === "PAYOUT" && t.status === "SUCCESS").reduce((s, t) => s + Number(t.amount), 0)

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toISOString().split("T")[0]
    const dayTx = businessTx.filter((t) => t.created_at.split("T")[0] === dateStr)
    return {
      name: d.toLocaleDateString("en", { weekday: "short" }),
      revenue: dayTx.filter((t) => t.type === "COLLECTION" && t.status === "SUCCESS").reduce((s, t) => s + Number(t.amount), 0),
      expenses: dayTx.filter((t) => t.type === "PAYOUT" && t.status === "SUCCESS").reduce((s, t) => s + Number(t.amount), 0),
    }
  })

  return (
    <DashboardShell breadcrumb="Business Dashboard">
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <HugeiconsIcon icon={Store04Icon} className="size-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{activeBusiness.business_name}</h1>
          <p className="text-sm text-muted-foreground">{activeBusiness.business_type.replace(/_/g, " ")}</p>
        </div>
        <Badge variant={activeBusiness.kyc_status === "APPROVED" ? "default" : "secondary"} className="ml-2">
          KYC: {activeBusiness.kyc_status}
        </Badge>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><Spinner className="size-8" /></div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-primary text-primary-foreground border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
                <HugeiconsIcon icon={Wallet01Icon} className="size-4 opacity-70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">TZS {balance.toLocaleString()}</div>
                <p className="text-xs opacity-70 mt-1">{businessWallets.length} wallet(s)</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm dark:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">TZS {revenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">{businessTx.filter((t) => t.type === "COLLECTION" && t.status === "SUCCESS").length} transactions</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm dark:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                <HugeiconsIcon icon={ArrowUp01Icon} className="size-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">TZS {expenses.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">{businessTx.filter((t) => t.type === "PAYOUT" && t.status === "SUCCESS").length} transactions</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm dark:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
                <HugeiconsIcon icon={CheckmarkBadgeIcon} className="size-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">TZS {(revenue - expenses).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Revenue - Expenses</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4 border-none shadow-sm dark:bg-muted/50">
              <CardHeader><CardTitle>Revenue (Last 7 Days)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={last7Days}>
                    <defs>
                      <linearGradient id="bizRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => `TZS ${Number(value).toLocaleString()}`} />
                    <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="url(#bizRev)" name="Revenue" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 border-none shadow-sm dark:bg-muted/50">
              <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex-col gap-2 border-dashed" render={<Link href="/dashboard/payments" />}>
                  <HugeiconsIcon icon={ArrowDown01Icon} className="size-5 text-green-500" />
                  Receive Payment
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 border-dashed" render={<Link href="/dashboard/settlements" />}>
                  <HugeiconsIcon icon={BankIcon} className="size-5" />
                  Settle
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 border-dashed" render={<Link href="/dashboard/staff" />}>
                  <HugeiconsIcon icon={UserGroupIcon} className="size-5" />
                  Manage Staff
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 border-dashed" render={<Link href="/dashboard/kyc" />}>
                  <HugeiconsIcon icon={CheckmarkBadgeIcon} className="size-5" />
                  KYC Status
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-sm dark:bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Business Transactions</CardTitle>
              <Button variant="ghost" size="sm" render={<Link href="/dashboard/transactions" />}>View All</Button>
            </CardHeader>
            <CardContent>
              {businessTx.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">No transactions yet.</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {businessTx.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`flex size-8 items-center justify-center rounded-full ${tx.type === "COLLECTION" ? "bg-green-500/10" : "bg-destructive/10"}`}>
                          <HugeiconsIcon icon={tx.type === "COLLECTION" ? ArrowDown01Icon : ArrowUp01Icon} className={`size-4 ${tx.type === "COLLECTION" ? "text-green-500" : "text-destructive"}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{tx.channel}</p>
                          <p className="text-xs text-muted-foreground">{tx.reference}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">TZS {Number(tx.amount).toLocaleString()}</p>
                        <Badge variant={tx.status === "SUCCESS" ? "default" : tx.status === "PENDING" ? "secondary" : "destructive"}>
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </DashboardShell>
  )
}
