"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Wallet01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  UserGroupIcon,
  CreditCardIcon,
  PlusSignIcon,
  CheckmarkBadgeIcon,
} from "@hugeicons/core-free-icons"
import { useAuth } from "@/lib/auth-context"
import { walletsApi, paymentsApi } from "@/lib/api"
import type { Wallet, Transaction } from "@/lib/types"
import Link from "next/link"

export default function Page() {
  const { user, activeBusiness, businesses } = useAuth()
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const greeting = user ? `Habari, ${user.full_name.split(" ")[0]}!` : "Habari!"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletData, txData] = await Promise.all([
          walletsApi.list().catch(() => []),
          paymentsApi.transactions().catch(() => []),
        ])
        setWallets(walletData)
        setTransactions(txData)
      } catch {
        // handle error
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalBalance = wallets.reduce((sum, w) => sum + Number(w.balance), 0)
  const moneyIn = transactions
    .filter((t) => t.type === "COLLECTION" && t.status === "SUCCESS")
    .reduce((sum, t) => sum + Number(t.amount), 0)
  const moneyOut = transactions
    .filter((t) => t.type === "PAYOUT" && t.status === "SUCCESS")
    .reduce((sum, t) => sum + Number(t.amount), 0)
  const recentTransactions = transactions.slice(0, 5)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Salamapay
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-4">
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6">
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

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4 border-none shadow-sm overflow-hidden dark:bg-muted/50">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
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
                <Button variant="outline" className="h-20 flex-col gap-2 border-dashed" render={<Link href="/dashboard/kyc" />}>
                  <HugeiconsIcon icon={CheckmarkBadgeIcon} className="size-5" />
                  Verify KYC
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 border-dashed" render={<Link href="/dashboard/transactions" />}>
                  <HugeiconsIcon icon={CreditCardIcon} className="size-5" />
                  Transactions
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 border-dashed" render={<Link href="/dashboard/wallets" />}>
                  <HugeiconsIcon icon={Wallet01Icon} className="size-5" />
                  Wallets
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}


