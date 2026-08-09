"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Wallet01Icon, ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons"
import { walletsApi } from "@/lib/api"
import type { Wallet } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"

export default function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const { activeBusiness } = useAuth()

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const data = await walletsApi.list()
        setWallets(data)
      } catch {
        setError("Failed to load wallets. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchWallets()
  }, [])

  const totalBalance = wallets.reduce((sum, w) => sum + Number(w.balance), 0)

  return (
    <DashboardShell breadcrumb="Wallets">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Wallets</h1>
        <p className="text-muted-foreground">Manage your personal and business wallets.</p>
      </div>

      <Card className="bg-primary text-primary-foreground border-none shadow-sm max-w-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <HugeiconsIcon icon={Wallet01Icon} className="size-4 opacity-70" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">TZS {totalBalance.toLocaleString()}</div>
          <p className="text-xs opacity-70 mt-1">{wallets.length} wallet(s)</p>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Spinner className="size-6" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-8 text-center text-destructive">{error}</CardContent>
        </Card>
      ) : wallets.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
            <HugeiconsIcon icon={Wallet01Icon} className="size-12 text-muted-foreground" />
            <p className="text-muted-foreground">No wallets found. Your wallet will be created automatically.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {wallets.map((wallet) => (
            <Card key={wallet.id} className={wallet.wallet_type === "BUSINESS" ? "border-primary/20" : ""}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {wallet.wallet_type === "BUSINESS" ? "Business Wallet" : "Personal Wallet"}
                </CardTitle>
                <Badge variant={wallet.is_active ? "default" : "outline"}>
                  {wallet.is_active ? "Active" : "Inactive"}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {wallet.currency} {Number(wallet.balance).toLocaleString()}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 text-green-500" />
                    Deposit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <HugeiconsIcon icon={ArrowUp01Icon} className="size-4 text-destructive" />
                    Withdraw
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
