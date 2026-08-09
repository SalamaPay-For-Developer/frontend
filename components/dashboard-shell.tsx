"use client"

import { ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

interface DashboardShellProps {
  children: ReactNode
  breadcrumb: string
  parentLabel?: string
  parentHref?: string
}

export function DashboardShell({
  children,
  breadcrumb,
  parentLabel = "Salamapay",
  parentHref = "/dashboard",
}: DashboardShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2 px-3 sm:px-4 min-w-0">
            <SidebarTrigger className="-ml-1 shrink-0" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto shrink-0"
            />
            <Breadcrumb className="min-w-0">
              <BreadcrumbList className="min-w-0">
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={parentHref}>
                    {parentLabel}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="min-w-0">
                  <BreadcrumbPage className="truncate">{breadcrumb}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3 sm:px-4 shrink-0">
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-3 sm:gap-6 sm:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
