"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { businessApi, ApiError } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

export default function KycPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [ownerNationalId, setOwnerNationalId] = useState("")
  const [ownerAddress, setOwnerAddress] = useState("")
  const [ownerPhone, setOwnerPhone] = useState("")
  const [bankName, setBankName] = useState("")
  const [bankAccountNumber, setBankAccountNumber] = useState("")
  const [bankAccountName, setBankAccountName] = useState("")
  const { activeBusiness } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeBusiness) return
    setError("")
    setSuccess("")
    setIsLoading(true)
    try {
      await businessApi.submitKyc(activeBusiness.id, {
        owner_national_id: ownerNationalId || undefined,
        owner_address: ownerAddress || undefined,
        owner_phone: ownerPhone || undefined,
        bank_name: bankName || undefined,
        bank_account_number: bankAccountNumber || undefined,
        bank_account_name: bankAccountName || undefined,
      })
      setSuccess("KYC submitted successfully! Your application is under review.")
    } catch (err) {
      if (err instanceof ApiError) {
        const data = err.data as Record<string, unknown>
        const detail = data?.detail
        const msg = typeof detail === "string" ? detail : Object.values(data).flat().join(", ") || err.message
        setError(msg)
      } else {
        setError("Failed to submit KYC. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!activeBusiness) {
    return (
      <DashboardShell breadcrumb="KYC">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Please select or create a business first.</p>
          </CardContent>
        </Card>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell breadcrumb="KYC Verification">
      <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">KYC Verification</h1>
              <Badge variant={activeBusiness.kyc_status === "APPROVED" ? "default" : "secondary"}>
                {activeBusiness.kyc_status}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Submit your business KYC documents for verification to unlock all features.
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}
          {success && (
            <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-500">{success}</div>
          )}

          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Card>
                <CardHeader>
                  <CardTitle>Owner Information</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <Field>
                    <FieldLabel htmlFor="national_id">National ID (NIDA)</FieldLabel>
                    <Input
                      id="national_id"
                      placeholder="e.g. 19901234567890123456"
                      value={ownerNationalId}
                      onChange={(e) => setOwnerNationalId(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="address">Address</FieldLabel>
                    <Textarea
                      id="address"
                      placeholder="Physical address"
                      value={ownerAddress}
                      onChange={(e) => setOwnerAddress(e.target.value)}
                      rows={2}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="owner_phone">Owner Phone</FieldLabel>
                    <Input
                      id="owner_phone"
                      placeholder="+255712345678"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                    />
                  </Field>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bank / Settlement Details</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <Field>
                    <FieldLabel htmlFor="bank_name">Bank Name</FieldLabel>
                    <Input
                      id="bank_name"
                      placeholder="e.g. CRDB Bank"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="bank_account_number">Account Number</FieldLabel>
                    <Input
                      id="bank_account_number"
                      placeholder="e.g. 0151234567890"
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="bank_account_name">Account Name</FieldLabel>
                    <Input
                      id="bank_account_name"
                      placeholder="e.g. Mama Asha Restaurant"
                      value={bankAccountName}
                      onChange={(e) => setBankAccountName(e.target.value)}
                    />
                  </Field>
                </CardContent>
              </Card>

              <Button type="submit" disabled={isLoading}>
                {isLoading && <Spinner data-icon="inline-start" />}
                {isLoading ? "Submitting..." : "Submit KYC"}
              </Button>
            </FieldGroup>
          </form>
      </div>
    </DashboardShell>
  )
}
