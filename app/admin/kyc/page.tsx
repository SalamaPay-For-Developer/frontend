"use client"

import { useState, useEffect } from "react"
import { AdminShell } from "@/components/admin-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { adminApi } from "@/lib/api"
import type { AdminBusiness } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"

export default function AdminKycPage() {
  const [businesses, setBusinesses] = useState<AdminBusiness[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchKyc = async () => {
      try {
        setBusinesses(await adminApi.businesses({ kyc_status: "PENDING" }))
      } catch { /* ignore */ } finally {
        setIsLoading(false)
      }
    }
    fetchKyc()
  }, [])

  const handleApprove = async (id: string) => {
    try {
      await adminApi.approveKyc(id)
      setBusinesses(businesses.filter((b) => b.id !== id))
    } catch { /* ignore */ }
  }

  const handleReject = async (id: string) => {
    try {
      await adminApi.rejectKyc(id, "Did not meet requirements")
      setBusinesses(businesses.filter((b) => b.id !== id))
    } catch { /* ignore */ }
  }

  return (
    <AdminShell breadcrumb="KYC">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">KYC Management</h1>
        <p className="text-muted-foreground">Review and approve business KYC submissions.</p>
      </div>

      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8"><Spinner className="size-6" /></div>
          ) : businesses.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              No pending KYC submissions.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>TIN</TableHead>
                  <TableHead>License</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.business_name}</TableCell>
                    <TableCell className="text-sm">{b.owner_name}</TableCell>
                    <TableCell><Badge variant="outline">{b.business_type}</Badge></TableCell>
                    <TableCell className="font-mono text-sm">{b.tin || "—"}</TableCell>
                    <TableCell className="font-mono text-sm">{b.business_license || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(b.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleApprove(b.id)}>
                          <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4 text-green-500" />
                          Approve
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleReject(b.id)}>
                          <HugeiconsIcon icon={Cancel01Icon} className="size-4 text-destructive" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  )
}
