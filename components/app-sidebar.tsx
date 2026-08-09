"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
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
import {
  Settings05Icon,
  SentIcon,
  PieChartIcon,
  ChartRingIcon,
  PlusSignIcon,
  Wallet01Icon,
  CreditCardIcon,
  QrCode01Icon,
  Link02Icon,
  ChartColumnIcon,
  BankIcon,
  CustomerSupportIcon,
  BellIcon,
  UserCircleIcon,
  Store04Icon,
  UserGroupIcon,
  Building04Icon,
  FileHeartIcon,
} from "@hugeicons/core-free-icons"
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

  const hasBusiness = businesses.length > 0

  const personalNav = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <HugeiconsIcon icon={PieChartIcon} strokeWidth={2} />,
      isActive: true,
    },
    {
      title: "Payments",
      url: "/dashboard/payments",
      icon: <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} />,
    },
    {
      title: "Payment Profiles",
      url: "/dashboard/payments/profiles",
      icon: <HugeiconsIcon icon={Link02Icon} strokeWidth={2} />,
    },
    {
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: <HugeiconsIcon icon={SentIcon} strokeWidth={2} />,
      items: [
        { title: "All Transactions", url: "/dashboard/transactions" },
        { title: "Successful", url: "/dashboard/transactions?status=SUCCESS" },
        { title: "Pending", url: "/dashboard/transactions?status=PENDING" },
        { title: "Failed", url: "/dashboard/transactions?status=FAILED" },
      ],
    },
    {
      title: "Wallets",
      url: "/dashboard/wallets",
      icon: <HugeiconsIcon icon={Wallet01Icon} strokeWidth={2} />,
    },
    {
      title: "Savings",
      url: "/dashboard/savings",
      icon: <HugeiconsIcon icon={ChartRingIcon} strokeWidth={2} />,
    },
  ]

  const businessNav = hasBusiness ? [
    {
      title: "Business Dashboard",
      url: "/dashboard/business",
      icon: <HugeiconsIcon icon={Store04Icon} strokeWidth={2} />,
    },
    {
      title: "My Businesses",
      url: "/dashboard/businesses",
      icon: <HugeiconsIcon icon={Building04Icon} strokeWidth={2} />,
    },
    {
      title: "Staff & Roles",
      url: "/dashboard/staff",
      icon: <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} />,
    },
    {
      title: "Settlements",
      url: "/dashboard/settlements",
      icon: <HugeiconsIcon icon={BankIcon} strokeWidth={2} />,
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: <HugeiconsIcon icon={ChartColumnIcon} strokeWidth={2} />,
    },
    {
      title: "KYC",
      url: "/dashboard/kyc",
      icon: <HugeiconsIcon icon={FileHeartIcon} strokeWidth={2} />,
    },
  ] : []

  const navMain = [...personalNav, ...businessNav]

  const navSecondary = [
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: <HugeiconsIcon icon={BellIcon} strokeWidth={2} />,
    },
    {
      title: "Support",
      url: "/dashboard/support",
      icon: <HugeiconsIcon icon={CustomerSupportIcon} strokeWidth={2} />,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: <HugeiconsIcon icon={UserCircleIcon} strokeWidth={2} />,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />,
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
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}

