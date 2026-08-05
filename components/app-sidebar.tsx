"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { Settings05Icon, SentIcon, PieChartIcon, MapsIcon, ChartRingIcon, PlusSignIcon } from "@hugeicons/core-free-icons"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, businesses, activeBusiness, setActiveBusiness } = useAuth()

  const teams = businesses.map((b) => ({
    id: b.id,
    name: b.business_name,
    logo: <span className="text-xs font-bold">{b.business_name.charAt(0)}</span>,
    plan: b.business_type,
  }))

  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <HugeiconsIcon icon={PieChartIcon} strokeWidth={2} />,
      isActive: true,
    },
    {
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: <HugeiconsIcon icon={SentIcon} strokeWidth={2} />,
      items: [
        { title: "All Transactions", url: "/dashboard/transactions" },
        { title: "Pending", url: "/dashboard/transactions?status=PENDING" },
        { title: "Completed", url: "/dashboard/transactions?status=SUCCESS" },
      ],
    },
    {
      title: "Wallets",
      url: "/dashboard/wallets",
      icon: <HugeiconsIcon icon={ChartRingIcon} strokeWidth={2} />,
      items: [
        { title: "My Wallets", url: "/dashboard/wallets" },
      ],
    },
  ]

  const navSecondary = [
    {
      title: "Support",
      url: "#",
      icon: <HugeiconsIcon icon={ChartRingIcon} strokeWidth={2} />,
    },
    {
      title: "Settings",
      url: "#",
      icon: <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />,
    },
  ]

  const projects = [
    {
      name: "Customers",
      url: "#",
      icon: <HugeiconsIcon icon={MapsIcon} strokeWidth={2} />,
    },
    {
      name: "Reports",
      url: "#",
      icon: <HugeiconsIcon icon={PieChartIcon} strokeWidth={2} />,
    },
  ]

  const userData = user
    ? {
        name: user.full_name,
        email: user.phone_number,
        avatar: "",
      }
    : { name: "Guest", email: "", avatar: "" }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        {teams.length > 0 ? (
          <TeamSwitcher teams={teams} />
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" render={<Link href="/dashboard/onboarding" />}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Add Business</span>
                  <span className="truncate text-xs">Get started</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={projects} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}

