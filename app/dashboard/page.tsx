import { AppSidebar } from "@/components/app-sidebar"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Wallet01Icon, 
  ArrowUp01Icon, 
  ArrowDown01Icon, 
  UserGroupIcon,
  CreditCardIcon
} from "@hugeicons/core-free-icons"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Salamapay
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-4">
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Habari, Amina!</h1>
            <p className="text-muted-foreground">Karibu kwenye dashboard yako ya Salamapay.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-none shadow-sm bg-primary text-primary-foreground">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <HugeiconsIcon icon={Wallet01Icon} className="size-4 opacity-70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">TZS 1,245,000</div>
                <p className="text-xs opacity-70 mt-1">+12.5% from last month</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm dark:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Money In</CardTitle>
                <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">TZS 850,000</div>
                <p className="text-xs text-muted-foreground mt-1">This week</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm dark:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Money Out</CardTitle>
                <HugeiconsIcon icon={ArrowUp01Icon} className="size-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">TZS 320,000</div>
                <p className="text-xs text-muted-foreground mt-1">This week</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm dark:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
                <HugeiconsIcon icon={CreditCardIcon} className="size-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground mt-1">All systems active</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4 border-none shadow-sm overflow-hidden dark:bg-muted/50">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { name: "Sent to Juma Msuya", amount: "- TZS 45,000", time: "2 hours ago", icon: ArrowUp01Icon, color: "text-destructive" },
                    { name: "Received from Mama Sarah", amount: "+ TZS 120,000", time: "5 hours ago", icon: ArrowDown01Icon, color: "text-green-500" },
                    { name: "Electricity Bill (LUKU)", amount: "- TZS 50,000", time: "Yesterday", icon: ArrowUp01Icon, color: "text-destructive" },
                    { name: "Top-up Wallet", amount: "+ TZS 200,000", time: "Yesterday", icon: ArrowDown01Icon, color: "text-green-500" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className={cn("size-9 rounded-full bg-muted flex items-center justify-center", item.color)}>
                        <HugeiconsIcon icon={item.icon} className="size-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                      <div className={cn("text-sm font-bold", item.color)}>{item.amount}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3 border-none shadow-sm dark:bg-muted/50">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2 border-dashed">
                  <HugeiconsIcon icon={Wallet01Icon} className="size-5" />
                  Send Money
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 border-dashed">
                  <HugeiconsIcon icon={CreditCardIcon} className="size-5" />
                  Pay Bills
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 border-dashed">
                  <HugeiconsIcon icon={ArrowUp01Icon} className="size-5" />
                  Top-up
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 border-dashed">
                  <HugeiconsIcon icon={UserGroupIcon} className="size-5" />
                  Invite Friend
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

