"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { businessApi, modulesApi, ApiError } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import type { BusinessModule, BusinessType } from "@/lib/types"
import { cn } from "@/lib/utils"

const BUSINESS_TYPES: { value: BusinessType; label: string; icon: string }[] = [
  { value: "RESTAURANT", label: "Restaurant", icon: "🍽️" },
  { value: "HOTEL", label: "Hotel", icon: "🏨" },
  { value: "SCHOOL", label: "School", icon: "🎓" },
  { value: "PHARMACY", label: "Pharmacy", icon: "💊" },
  { value: "FUEL_STATION", label: "Fuel Station", icon: "⛽" },
  { value: "TRANSPORT", label: "Transport", icon: "🚌" },
  { value: "PROPERTY", label: "Property", icon: "🏠" },
  { value: "RETAIL_SHOP", label: "Retail Shop", icon: "🛒" },
  { value: "MALL", label: "Mall / Entertainment", icon: "🏬" },
  { value: "GENERAL", label: "General Business", icon: "🏢" },
]

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [businessType, setBusinessType] = useState<BusinessType>("GENERAL")
  const [description, setDescription] = useState("")
  const [tin, setTin] = useState("")
  const [brelaNumber, setBrelaNumber] = useState("")
  const [businessLicense, setBusinessLicense] = useState("")
  const [modules, setModules] = useState<BusinessModule[]>([])
  const [selectedModule, setSelectedModule] = useState<string>("")
  const [loadingModules, setLoadingModules] = useState(true)
  const { refreshBusinesses } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const data = await modulesApi.list()
        setModules(data)
      } catch {
        // Modules are optional during onboarding
      } finally {
        setLoadingModules(false)
      }
    }
    fetchModules()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      const business = await businessApi.create({
        business_name: businessName,
        business_type: businessType,
        description,
        tin: tin || undefined,
        brela_number: brelaNumber || undefined,
        business_license: businessLicense || undefined,
      })

      if (selectedModule) {
        await modulesApi.setConfig({
          business: business.id,
          module: selectedModule,
        })
      }

      await refreshBusinesses()
      router.push("/dashboard")
    } catch (err) {
      if (err instanceof ApiError) {
        const data = err.data as Record<string, unknown>
        const detail = data?.detail
        const msg = typeof detail === "string" ? detail : Object.values(data).flat().join(", ") || err.message
        setError(msg)
      } else {
        setError("Failed to create business. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

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
                  <BreadcrumbPage>New Business</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-4">
            <ModeToggle />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Onboard Your Business</h1>
            <p className="text-muted-foreground">Create a new business to start accepting payments.</p>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <Field>
                    <FieldLabel htmlFor="business_name">Business Name</FieldLabel>
                    <Input
                      id="business_name"
                      placeholder="e.g. Mama Asha Restaurant"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Business Type</FieldLabel>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {BUSINESS_TYPES.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setBusinessType(type.value)}
                          className={cn(
                            "flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors hover:bg-accent",
                            businessType === type.value && "border-primary bg-primary/5"
                          )}
                        >
                          <span className="text-2xl">{type.icon}</span>
                          <span className="text-xs font-medium">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="description">Description (Optional)</FieldLabel>
                    <Textarea
                      id="description"
                      placeholder="Brief description of your business"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </Field>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Legal Information (Optional)</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <Field>
                    <FieldLabel htmlFor="tin">TIN Number</FieldLabel>
                    <Input
                      id="tin"
                      placeholder="e.g. 123-456-789"
                      value={tin}
                      onChange={(e) => setTin(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="brela">BRELA Number</FieldLabel>
                    <Input
                      id="brela"
                      placeholder="e.g. 123456"
                      value={brelaNumber}
                      onChange={(e) => setBrelaNumber(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="license">Business License</FieldLabel>
                    <Input
                      id="license"
                      placeholder="e.g. BL-2024-001"
                      value={businessLicense}
                      onChange={(e) => setBusinessLicense(e.target.value)}
                    />
                  </Field>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Choose Dashboard Module</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {loadingModules ? (
                    <div className="flex items-center justify-center py-8">
                      <Spinner className="size-6" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {modules.map((mod) => (
                        <button
                          key={mod.id}
                          type="button"
                          onClick={() => setSelectedModule(mod.id)}
                          className={cn(
                            "flex flex-col gap-1 rounded-lg border p-4 text-left transition-colors hover:bg-accent",
                            selectedModule === mod.id && "border-primary bg-primary/5"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{mod.icon || "📦"}</span>
                            <span className="font-medium text-sm">{mod.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{mod.description}</p>
                          {mod.features.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {mod.features.slice(0, 4).map((f) => (
                                <span key={f.id} className="text-[10px] bg-muted px-2 py-0.5 rounded-full">
                                  {f.label}
                                </span>
                              ))}
                              {mod.features.length > 4 && (
                                <span className="text-[10px] text-muted-foreground">
                                  +{mod.features.length - 4} more
                                </span>
                              )}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button type="submit" disabled={isLoading || !businessName}>
                {isLoading && <Spinner data-icon="inline-start" />}
                {isLoading ? "Creating..." : "Create Business"}
              </Button>
            </FieldGroup>
          </form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
