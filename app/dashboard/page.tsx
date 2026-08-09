"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Wallet01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  PlusSignIcon,
  CheckmarkBadgeIcon,
  CreditCardIcon,
  ChartColumnIcon,
} from "@hugeicons/core-free-icons"
import { useAuth } from "@/lib/auth-context"
import { walletsApi, paymentsApi } from "@/lib/api"
import type { Wallet, Transaction, TransactionSummary } from "@/lib/types"
import Link from "next/link"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

export default function Page() {
  const { user, activeBusiness, businesses } = useAuth()
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState<TransactionSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const greeting = user ? `Habari, ${user.full_name.split(" ")[0]}!` : "Habari!"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletData, txData, summaryData] = await Promise.all([
          walletsApi.list().catch(() => []),
          paymentsApi.transactions().catch(() => []),
          paymentsApi.summary().catch(() => null),
        ])
        setWallets(walletData)
        setTransactions(txData)
        if (summaryData) setSummary(summaryData)
      } catch {
        // handle error
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalBalance = wallets.reduce((sum, w) => sum + Number(w.balance), 0)
  const moneyIn = summary ? Number(summary.total_income) : transactions
    .filter((t) => t.type === "COLLECTION" && t.status === "SUCCESS")
    .reduce((sum, t) => sum + Number(t.amount), 0)
  const moneyOut = summary ? Number(summary.total_expense) : transactions
    .filter((t) => t.type === "PAYOUT" && t.status === "SUCCESS")
    .reduce((sum, t) => sum + Number(t.amount), 0)
  const recentTransactions = transactions.slice(0, 6)

  // Chart data: last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toISOString().split("T")[0]
    const dayTx = transactions.filter((t) => t.created_at.split("T")[0] === dateStr)
    const income = dayTx.filter((t) => t.type === "COLLECTION" && t.status === "SUCCESS").reduce((s, t) => s + Number(t.amount), 0)
    const expense = dayTx.filter((t) => t.type === "PAYOUT" && t.status === "SUCCESS").reduce((s, t) => s + Number(t.amount), 0)
    return {
      name: d.toLocaleDateString("en", { weekday: "short" }),
      income,
      expense,
    }
  })

  // Payment method distribution
  const channelColors: Record<string, string> = {
    MPESA: "#10B981",
    TIGOPESA: "#0EA5E9",
    AIRTEL: "#EF4444",
    HALOPESA: "#F59E0B",
    CARD: "#8B5CF6",
    BANK: "#3B82F6",
  }
  const channelData = Object.entries(
    transactions.reduce((acc, t) => {
      if (t.status === "SUCCESS") {
        acc[t.channel] = (acc[t.channel] || 0) + Number(t.amount)
      }
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  return (
    <DashboardShell breadcrumb="Dashboard Overview">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{greeting}</h1>
        <p className="text-muted-foreground">
          Karibu kwenye dashboard yako ya Salamapay.
        </p>
      </div>

      {/* No businesses - show onboarding CTA */}
      {businesses.length === 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-12">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
              <HugeiconsIcon icon={PlusSignIcon} className="size-6 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">Start Your Journey</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first business to start accepting payments.
              </p>
            </div>
            <Button render={<Link href="/dashboard/onboarding" />}>
              <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
              Add Business
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Active business - show KYC status */}
      {activeBusiness && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Business:</span>
          <span className="font-medium">{activeBusiness.business_name}</span>
          <Badge variant={activeBusiness.kyc_status === "APPROVED" ? "default" : "secondary"}>
            KYC: {activeBusiness.kyc_status}
          </Badge>
          {activeBusiness.kyc_status !== "APPROVED" && (
            <Button variant="outline" size="sm" render={<Link href="/dashboard/kyc" />}>
              Complete KYC
            </Button>
          )}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <HugeiconsIcon icon={Wallet01Icon} className="size-4 opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">TZS {totalBalance.toLocaleString()}</div>
            <p className="text-xs opacity-70 mt-1">
              {wallets.length > 0 ? `${wallets.length} wallet${wallets.length > 1 ? "s" : ""}` : "No wallets yet"}
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Money In</CardTitle>
            <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">TZS {moneyIn.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {transactions.filter((t) => t.type === "COLLECTION" && t.status === "SUCCESS").length} successful
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Money Out</CardTitle>
            <HugeiconsIcon icon={ArrowUp01Icon} className="size-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">TZS {moneyOut.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {transactions.filter((t) => t.type === "PAYOUT" && t.status === "SUCCESS").length} successful
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Businesses</CardTitle>
            <HugeiconsIcon icon={CheckmarkBadgeIcon} className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businesses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {businesses.length === 1 ? "Active" : "Active businesses"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-none shadow-sm dark:bg-muted/50">
          <CardHeader>
            <CardTitle>Revenue (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={last7Days}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
                  formatter={(value) => [`TZS ${Number(value).toLocaleString()}`, ""]}
                />
                <Area type="monotone" dataKey="income" stroke="#10B981" fillOpacity={1} fill="url(#colorIncome)" name="Income" />
                <Area type="monotone" dataKey="expense" stroke="#EF4444" fillOpacity={1} fill="url(#colorExpense)" name="Expense" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-none shadow-sm dark:bg-muted/50">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            {channelData.length === 0 ? (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
                No data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={channelData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {channelData.map((entry, i) => (
                      <Cell key={i} fill={channelColors[entry.name] || "#94A3B8"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `TZS ${Number(value).toLocaleString()}`} />
                  <Legend className="text-xs" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent activity + Quick actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-none shadow-sm overflow-hidden dark:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" render={<Link href="/dashboard/transactions" />}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                Loading...
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                No recent activity.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`flex size-8 items-center justify-center rounded-full ${tx.type === "COLLECTION" ? "bg-green-500/10" : "bg-destructive/10"}`}>
                        <HugeiconsIcon
                          icon={tx.type === "COLLECTION" ? ArrowDown01Icon : ArrowUp01Icon}
                          className={`size-4 ${tx.type === "COLLECTION" ? "text-green-500" : "text-destructive"}`}
                        />
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
        <Card className="lg:col-span-3 border-none shadow-sm dark:bg-muted/50">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2 border-dashed" render={<Link href="/dashboard/onboarding" />}>
              <HugeiconsIcon icon={PlusSignIcon} className="size-5" />
              New Business
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 border-dashed" render={<Link href="/dashboard/payments" />}>
              <HugeiconsIcon icon={CreditCardIcon} className="size-5" />
              Make Payment
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 border-dashed" render={<Link href="/dashboard/transactions" />}>
              <HugeiconsIcon icon={ChartColumnIcon} className="size-5" />
              Transactions
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 border-dashed" render={<Link href="/dashboard/wallets" />}>
              <HugeiconsIcon icon={Wallet01Icon} className="size-5" />
              Wallets
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}


