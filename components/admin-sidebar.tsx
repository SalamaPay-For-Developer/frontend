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
  UserCircleIcon,
  Store04Icon,
  CheckmarkBadgeIcon,
  SentIcon,
  Cancel01Icon,
  BankIcon,
  CreditCardIcon,
  Wallet01Icon,
  Settings05Icon,
  UserGroupIcon,
  Key01Icon,
  Building04Icon,
  ArrowDown01Icon,
  PlugSocketIcon,
  ChartColumnIcon,
  CodeIcon,
  WebhookIcon,
  BellIcon,
  ShieldKeyIcon,
  CustomerSupportIcon,
  ArrowLeft01Icon,
  PercentIcon,
  AiPhoneIcon,
  Cancel01Icon as XIcon,
} from "@hugeicons/core-free-icons"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  const navGroups = [
    {
      section: "Overview",
      items: [
        { title: "Overview", url: "/admin", icon: PieChartIcon },
      ],
    },
    {
      section: "Customers",
      items: [
        { title: "Users", url: "/admin/users", icon: UserCircleIcon },
        { title: "Businesses", url: "/admin/businesses", icon: Store04Icon },
        { title: "KYC", url: "/admin/kyc", icon: CheckmarkBadgeIcon },
        { title: "Business Types", url: "/admin/business-types", icon: Building04Icon },
      ],
    },
    {
      section: "Payments",
      items: [
        { title: "Transactions", url: "/admin/transactions", icon: SentIcon },
        { title: "Refunds", url: "/admin/refunds", icon: Cancel01Icon },
        { title: "Settlements", url: "/admin/settlements", icon: BankIcon },
        { title: "Reconciliation", url: "/admin/reconciliation", icon: SentIcon },
      ],
    },
    {
      section: "Services",
      items: [
        { title: "Payment Services", url: "/admin/services", icon: CreditCardIcon },
        { title: "Billers", url: "/admin/billers", icon: ArrowDown01Icon },
        { title: "Integrations", url: "/admin/integrations", icon: PlugSocketIcon },
      ],
    },
    {
      section: "Finance",
      items: [
        { title: "Fees", url: "/admin/fees", icon: PercentIcon },
        { title: "Commissions", url: "/admin/commissions", icon: Wallet01Icon },
        { title: "Revenue", url: "/admin/revenue", icon: ChartColumnIcon },
      ],
    },
    {
      section: "People",
      items: [
        { title: "Staff", url: "/admin/staff", icon: UserGroupIcon },
        { title: "Roles", url: "/admin/roles", icon: Key01Icon },
        { title: "Departments", url: "/admin/departments", icon: Building04Icon },
        { title: "Branches", url: "/admin/branches", icon: Store04Icon },
      ],
    },
    {
      section: "Sales",
      items: [
        { title: "Leads", url: "/admin/leads", icon: UserGroupIcon },
        { title: "Pipeline", url: "/admin/pipeline", icon: ChartColumnIcon },
      ],
    },
    {
      section: "Support",
      items: [
        { title: "Call Center", url: "/admin/call-center", icon: AiPhoneIcon },
        { title: "Tickets", url: "/admin/tickets", icon: CustomerSupportIcon },
      ],
    },
    {
      section: "Developers",
      items: [
        { title: "Developer Accounts", url: "/admin/developers", icon: CodeIcon },
        { title: "API Logs", url: "/admin/api-logs", icon: CodeIcon },
        { title: "Webhooks", url: "/admin/webhooks", icon: WebhookIcon },
      ],
    },
    {
      section: "System",
      items: [
        { title: "Notifications", url: "/admin/notifications", icon: BellIcon },
        { title: "Audit Logs", url: "/admin/audit-logs", icon: ChartColumnIcon },
        { title: "Security", url: "/admin/security", icon: ShieldKeyIcon },
        { title: "Settings", url: "/admin/settings", icon: Settings05Icon },
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
              render={<Link href="/admin" />}
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-xs font-bold">SP</span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">SalamaPay</span>
                <span className="truncate text-xs text-muted-foreground">Admin Panel</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
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
                <SidebarMenuButton render={<Link href="/dashboard" />}>
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
              : { name: "Admin", email: "", avatar: "" }
          }
        />
      </SidebarFooter>
    </Sidebar>
  )
}
