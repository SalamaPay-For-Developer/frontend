"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Spinner } from "@/components/ui/spinner"
import { paymentsApi } from "@/lib/api"
import type { Transaction } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { Download04Icon, ChartColumnIcon } from "@hugeicons/core-free-icons"
import {
  Area,
  AreaChart,
  BarChart,
  Bar,
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

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState("30")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await paymentsApi.transactions()
        setTransactions(data)
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const days = parseInt(period)
  const filteredTx = useMemo(() => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    return transactions.filter((t) => new Date(t.created_at) >= cutoff)
  }, [transactions, days])

  const chartData = useMemo(() => {
    return Array.from({ length: days }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (days - 1 - i))
      const dateStr = d.toISOString().split("T")[0]
      const dayTx = filteredTx.filter((t) => t.created_at.split("T")[0] === dateStr)
      return {
        name: d.toLocaleDateString("en", { day: "numeric", month: "short" }),
        revenue: dayTx.filter((t) => t.type === "COLLECTION" && t.status === "SUCCESS").reduce((s, t) => s + Number(t.amount), 0),
        payments: dayTx.filter((t) => t.type === "PAYOUT" && t.status === "SUCCESS").reduce((s, t) => s + Number(t.amount), 0),
      }
    })
  }, [filteredTx, days])

  const channelColors: Record<string, string> = {
    MPESA: "#10B981", TIGOPESA: "#0EA5E9", AIRTEL: "#EF4444", HALOPESA: "#F59E0B", CARD: "#8B5CF6", BANK: "#3B82F6",
  }
  const channelData = Object.entries(
    filteredTx.reduce((acc, t) => {
      if (t.status === "SUCCESS") acc[t.channel] = (acc[t.channel] || 0) + Number(t.amount)
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  const totalRevenue = filteredTx.filter((t) => t.type === "COLLECTION" && t.status === "SUCCESS").reduce((s, t) => s + Number(t.amount), 0)
  const totalPayments = filteredTx.filter((t) => t.type === "PAYOUT" && t.status === "SUCCESS").reduce((s, t) => s + Number(t.amount), 0)
  const successCount = filteredTx.filter((t) => t.status === "SUCCESS").length
  const failedCount = filteredTx.filter((t) => t.status === "FAILED").length

  return (
    <DashboardShell breadcrumb="Reports">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Analyze your transaction performance.</p>
        </div>
        <Button variant="outline" size="sm">
          <HugeiconsIcon icon={Download04Icon} className="size-4" />
          Export
        </Button>
      </div>

      <Tabs value={period} onValueChange={setPeriod}>
        <TabsList>
          <TabsTrigger value="1">Today</TabsTrigger>
          <TabsTrigger value="7">7 Days</TabsTrigger>
          <TabsTrigger value="30">30 Days</TabsTrigger>
          <TabsTrigger value="90">90 Days</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Revenue</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-500">TZS {totalRevenue.toLocaleString()}</div></CardContent>
        </Card>
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Payments</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-destructive">TZS {totalPayments.toLocaleString()}</div></CardContent>
        </Card>
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Successful</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{successCount}</div></CardContent>
        </Card>
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Failed</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{failedCount}</div></CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><Spinner className="size-8" /></div>
      ) : (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 sm:gap-4">
          <Card className="border-none shadow-sm dark:bg-muted/50">
            <CardHeader><CardTitle>Revenue vs Payments</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="rRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="rPay" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => `TZS ${Number(value).toLocaleString()}`} />
                  <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="url(#rRev)" name="Revenue" />
                  <Area type="monotone" dataKey="payments" stroke="#EF4444" fill="url(#rPay)" name="Payments" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm dark:bg-muted/50">
            <CardHeader><CardTitle>Payment Methods</CardTitle></CardHeader>
            <CardContent>
              {channelData.length === 0 ? (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">No data</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={channelData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
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

          <Card className="border-none shadow-sm dark:bg-muted/50 md:col-span-2">
            <CardHeader><CardTitle>Daily Transaction Count</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData.map((d) => ({ ...d, count: filteredTx.filter((t) => t.created_at.split("T")[0] === new Date(d.name).toISOString().split("T")[0]).length }))}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Transactions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardShell>
  )
}
