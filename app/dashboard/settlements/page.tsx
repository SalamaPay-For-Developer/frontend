"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { HugeiconsIcon } from "@hugeicons/react"
import { BankIcon, ArrowDown01Icon, Download04Icon } from "@hugeicons/core-free-icons"

export default function SettlementsPage() {
  return (
    <DashboardShell breadcrumb="Settlements">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settlements</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your settlement balance and requests.</p>
      </div>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 sm:gap-4">
        <Card className="bg-primary text-primary-foreground border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <HugeiconsIcon icon={BankIcon} className="size-4 opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">TZS 0</div>
            <p className="text-xs opacity-70 mt-1">Ready for settlement</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">TZS 0</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting clearance</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Settled</CardTitle>
            <HugeiconsIcon icon={Download04Icon} className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">TZS 0</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Settlement</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 max-w-md">
          <div className="flex flex-col gap-2">
            <Label htmlFor="settle-amount">Settlement Amount (TZS)</Label>
            <Input id="settle-amount" type="number" placeholder="1000000" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="bank">Destination Bank Account</Label>
            <Input id="bank" placeholder="CRDB ****1234" />
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Settlement Fee</span>
            <span>TZS 0</span>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span>You Receive</span>
            <span>TZS 0</span>
          </div>
          <Button>
            <HugeiconsIcon icon={BankIcon} className="size-4" />
            Confirm Settlement
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settlement History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            No settlements yet.
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
