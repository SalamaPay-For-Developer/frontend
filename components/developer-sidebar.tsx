"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PieChartIcon,
  Key01Icon,
  Layers02Icon,
  ShieldKeyIcon,
  Store04Icon,
  CheckmarkBadgeIcon,
  UserGroupIcon,
  Settings05Icon,
  CreditCardIcon,
  ArrowLeft01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  BankIcon,
  WebhookIcon,
  Cancel01Icon,
  CodeIcon,
  TerminalIcon,
  ChartColumnIcon,
  Book02Icon,
  PlugSocketIcon,
  SentIcon,
} from "@hugeicons/core-free-icons"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

export function DeveloperSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  const devNav = [
    {
      section: "Overview",
      items: [
        { title: "Overview", url: "/developer", icon: PieChartIcon },
      ],
    },
    {
      section: "Developer",
      items: [
        { title: "API Keys", url: "/developer/api-keys", icon: Key01Icon },
        { title: "Environments", url: "/developer/environments", icon: Layers02Icon },
        { title: "Integrations", url: "/developer/integrations", icon: PlugSocketIcon },
        { title: "Security", url: "/developer/security", icon: ShieldKeyIcon },
      ],
    },
    {
      section: "Business",
      items: [
        { title: "Business Profile", url: "/developer/business", icon: Store04Icon },
        { title: "KYC", url: "/developer/kyc", icon: CheckmarkBadgeIcon },
        { title: "Team", url: "/developer/team", icon: UserGroupIcon },
        { title: "Settings", url: "/developer/settings", icon: Settings05Icon },
      ],
    },
    {
      section: "Payments",
      items: [
        { title: "Checkout", url: "/developer/checkout", icon: CreditCardIcon },
        { title: "Transactions", url: "/developer/transactions", icon: SentIcon },
        { title: "Refunds", url: "/developer/refunds", icon: ArrowUp01Icon },
        { title: "Settlements", url: "/developer/settlements", icon: BankIcon },
      ],
    },
    {
      section: "Services",
      items: [
        { title: "Collections", url: "/developer/collections", icon: ArrowDown01Icon },
        { title: "Utility Payments", url: "/developer/utilities", icon: SentIcon },
        { title: "Government", url: "/developer/government", icon: Store04Icon },
      ],
    },
    {
      section: "Webhooks",
      items: [
        { title: "Endpoints", url: "/developer/webhooks", icon: WebhookIcon },
        { title: "Deliveries", url: "/developer/deliveries", icon: Cancel01Icon },
        { title: "Logs", url: "/developer/webhook-logs", icon: ChartColumnIcon },
      ],
    },
    {
      section: "Developer Tools",
      items: [
        { title: "API Logs", url: "/developer/logs", icon: CodeIcon },
        { title: "Test Console", url: "/developer/console", icon: TerminalIcon },
      ],
    },
    {
      section: "Documentation",
      items: [
        { title: "Getting Started", url: "/developer/docs", icon: Book02Icon },
        { title: "API Reference", url: "/developer/docs/api", icon: Book02Icon },
      ],
    },
  ]

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/developer" />}
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-xs font-bold">SP</span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">SalamaPay</span>
                <span className="truncate text-xs text-muted-foreground">For Developers</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {devNav.map((group) => (
          <SidebarGroup key={group.section}>
            <SidebarGroupLabel>{group.section}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      render={<Link href={item.url} />}
                    >
                      <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/dashboard" />}
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
                  <span>Back to SalamaPay</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={
            user
              ? { name: user.full_name, email: user.phone_number, avatar: "" }
              : { name: "Developer", email: "", avatar: "" }
          }
        />
      </SidebarFooter>
    </Sidebar>
  )
}
