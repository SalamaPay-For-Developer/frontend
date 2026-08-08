"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Wallet01Icon, ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
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
      } catch (err) {
        setError("Failed to load wallets. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchWallets()
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Wallets</BreadcrumbPage>
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
            <h1 className="text-3xl font-bold tracking-tight">Wallets</h1>
            <p className="text-muted-foreground">Manage your personal and business wallets.</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="size-6" />
            </div>
          ) : error ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
                <p className="text-destructive">{error}</p>
              </CardContent>
            </Card>
          ) : wallets.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
                <HugeiconsIcon icon={Wallet01Icon} className="size-12 text-muted-foreground" />
                <p className="text-muted-foreground">No wallets found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
