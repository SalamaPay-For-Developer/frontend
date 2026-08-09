"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { businessApi } from "@/lib/api"
import type { Business, BusinessType } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PlusSignIcon,
  Building04Icon,
  CheckmarkBadgeIcon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  Store04Icon,
} from "@hugeicons/core-free-icons"
import Link from "next/link"

const BUSINESS_TYPES: { value: BusinessType; label: string; icon: string }[] = [
  { value: "RESTAURANT", label: "Restaurant", icon: "🍽️" },
  { value: "HOTEL", label: "Hotel", icon: "🏨" },
  { value: "SCHOOL", label: "School", icon: "🏫" },
  { value: "PHARMACY", label: "Pharmacy", icon: "💊" },
  { value: "FUEL_STATION", label: "Fuel Station", icon: "⛽" },
  { value: "TRANSPORT", label: "Transport", icon: "🚌" },
  { value: "PROPERTY", label: "Property", icon: "🏠" },
  { value: "RETAIL_SHOP", label: "Retail Shop", icon: "🛒" },
  { value: "TOURISM", label: "Tourism", icon: "🌍" },
  { value: "AGRICULTURE", label: "Agriculture / AMCOS", icon: "🌾" },
  { value: "EVENTS", label: "Events", icon: "🎉" },
  { value: "GYM", label: "Gym", icon: "💪" },
  { value: "PARKING", label: "Parking", icon: "🅿️" },
  { value: "GENERAL", label: "Other Business", icon: "📦" },
]

export default function BusinessesPage() {
  const { businesses, refreshBusinesses, setActiveBusiness, activeBusiness } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Form state
  const [bizName, setBizName] = useState("")
  const [bizType, setBizType] = useState<BusinessType>("RESTAURANT")
  const [tin, setTin] = useState("")
  const [description, setDescription] = useState("")

  const handleCreate = async () => {
    if (!bizName.trim()) {
      setError("Business name is required")
      return
    }
    setIsLoading(true)
    setError("")
    try {
      await businessApi.create({
        business_name: bizName,
        business_type: bizType,
        tin: tin || undefined,
        description: description || undefined,
      })
      await refreshBusinesses()
      setShowForm(false)
      setBizName("")
      setTin("")
      setDescription("")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create business"
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardShell breadcrumb="My Businesses">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Businesses</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage all your businesses in one place.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          Add Business
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Business</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 max-w-lg">
            <div className="flex flex-col gap-2">
              <Label htmlFor="biz-name">Business Name</Label>
              <Input id="biz-name" placeholder="Ezra Hotel" value={bizName} onChange={(e) => setBizName(e.target.value)} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Business Type</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BUSINESS_TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setBizType(t.value)}
                    className={`flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors ${bizType === t.value ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}
                  >
                    <span>{t.icon}</span>
                    <span className="text-left">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="tin">TIN (optional)</Label>
              <Input id="tin" placeholder="123-456-789" value={tin} onChange={(e) => setTin(e.target.value)} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="desc">Description (optional)</Label>
              <Input id="desc" placeholder="Brief description of your business" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={isLoading}>
                {isLoading ? <Spinner className="size-4" /> : <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" />}
                Create Business
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
        {businesses.length === 0 ? (
          <Card className="col-span-full border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-4 py-12">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                <HugeiconsIcon icon={Building04Icon} className="size-6 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">No Businesses Yet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Create your first business to start accepting payments.
                </p>
              </div>
              <Button onClick={() => setShowForm(true)}>
                <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
                Add Business
              </Button>
            </CardContent>
          </Card>
        ) : (
          businesses.map((biz) => (
            <Card key={biz.id} className={activeBusiness?.id === biz.id ? "border-primary" : ""}>
              <CardContent className="flex flex-col gap-3 pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <HugeiconsIcon icon={Store04Icon} className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{biz.business_name}</p>
                      <p className="text-xs text-muted-foreground">{biz.business_type.replace(/_/g, " ")}</p>
                    </div>
                  </div>
                  <Badge variant={biz.kyc_status === "APPROVED" ? "default" : biz.kyc_status === "PENDING" ? "secondary" : "destructive"}>
                    {biz.kyc_status === "APPROVED" && <HugeiconsIcon icon={CheckmarkBadgeIcon} className="size-3 mr-1" />}
                    {biz.kyc_status}
                  </Badge>
                </div>

                {biz.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{biz.description}</p>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {biz.is_active ? "Active" : "Inactive"}
                  </span>
                  <div className="flex gap-2">
                    {activeBusiness?.id !== biz.id && (
                      <Button size="sm" variant="outline" onClick={() => setActiveBusiness(biz)}>
                        Switch
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" render={<Link href="/dashboard/kyc" />}>
                      KYC
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardShell>
  )
}
