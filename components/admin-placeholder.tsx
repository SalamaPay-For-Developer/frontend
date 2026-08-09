"use client"

import { ReactNode } from "react"
import { AdminShell } from "@/components/admin-shell"
import { Card, CardContent } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"

interface AdminPlaceholderProps {
  title: string
  description: string
  icon: ReactNode
  breadcrumb: string
}

export function AdminPlaceholder({ title, description, icon, breadcrumb }: AdminPlaceholderProps) {
  return (
    <AdminShell breadcrumb={breadcrumb}>
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
          {icon}
          <div className="text-center">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-muted-foreground mt-1 max-w-md">{description}</p>
          </div>
          <Button variant="outline" render={<Link href="/admin" />}>
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            Back to Overview
          </Button>
        </CardContent>
      </Card>
    </AdminShell>
  )
}
