"use client"

import { useState, useEffect } from "react"
import { AdminShell } from "@/components/admin-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { adminApi } from "@/lib/api"
import type { AdminUser, AdminTransaction, AdminBusiness } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon, Cancel01Icon, CheckmarkCircle01Icon, UserCircleIcon,
} from "@hugeicons/core-free-icons"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [userTxns, setUserTxns] = useState<AdminTransaction[]>([])
  const [userBusinesses, setUserBusinesses] = useState<AdminBusiness[]>([])
  const [loadingDetail, setLoadingDetail] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminApi.users()
        setUsers(data)
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      const data = await adminApi.users(search ? { search } : {})
      setUsers(data)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewUser = async (user: AdminUser) => {
    setSelectedUser(user)
    setLoadingDetail(true)
    try {
      const [txns, businesses] = await Promise.all([
        adminApi.userTransactions(user.id).catch(() => []),
        adminApi.userBusinesses(user.id).catch(() => []),
      ])
      setUserTxns(txns)
      setUserBusinesses(businesses)
    } finally {
      setLoadingDetail(false)
    }
  }

  const handleSuspend = async (id: string) => {
    try {
      await adminApi.suspendUser(id)
      setUsers(users.map((u) => u.id === id ? { ...u, is_active: false } : u))
    } catch { /* ignore */ }
  }

  const handleActivate = async (id: string) => {
    try {
      await adminApi.activateUser(id)
      setUsers(users.map((u) => u.id === id ? { ...u, is_active: true } : u))
    } catch { /* ignore */ }
  }

  const handleVerify = async (id: string) => {
    try {
      await adminApi.verifyUserPhone(id)
      setUsers(users.map((u) => u.id === id ? { ...u, is_verified: true } : u))
    } catch { /* ignore */ }
  }

  return (
    <AdminShell breadcrumb="Users">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">View, search, and manage all SalamaPay users.</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8"><Spinner className="size-6" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Businesses</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.slice(0, 50).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell className="font-mono text-sm">{user.phone_number}</TableCell>
                    <TableCell className="text-sm">{user.email || "—"}</TableCell>
                    <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                    <TableCell>
                      <HugeiconsIcon
                        icon={user.is_verified ? CheckmarkCircle01Icon : Cancel01Icon}
                        className={`size-4 ${user.is_verified ? "text-green-500" : "text-muted-foreground"}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? "default" : "destructive"}>
                        {user.is_active ? "Active" : "Suspended"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{user.businesses_count}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleViewUser(user)}>View</Button>
                        {user.is_active ? (
                          <Button size="sm" variant="ghost" onClick={() => handleSuspend(user.id)}>Suspend</Button>
                        ) : (
                          <Button size="sm" variant="ghost" onClick={() => handleActivate(user.id)}>Activate</Button>
                        )}
                        {!user.is_verified && (
                          <Button size="sm" variant="ghost" onClick={() => handleVerify(user.id)}>Verify</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <HugeiconsIcon icon={UserCircleIcon} className="size-6" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{selectedUser.full_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.phone_number}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Email: </span>{selectedUser.email || "—"}</div>
                <div><span className="text-muted-foreground">Role: </span>{selectedUser.role}</div>
                <div><span className="text-muted-foreground">Verified: </span>{selectedUser.is_verified ? "Yes" : "No"}</div>
                <div><span className="text-muted-foreground">Status: </span>{selectedUser.is_active ? "Active" : "Suspended"}</div>
                <div><span className="text-muted-foreground">Businesses: </span>{selectedUser.businesses_count}</div>
                <div><span className="text-muted-foreground">Transactions: </span>{selectedUser.transactions_count}</div>
                <div><span className="text-muted-foreground">Joined: </span>{new Date(selectedUser.created_at).toLocaleDateString()}</div>
                <div><span className="text-muted-foreground">Staff: </span>{selectedUser.has_staff_profile ? "Yes" : "No"}</div>
              </div>

              {loadingDetail ? (
                <div className="flex justify-center py-4"><Spinner className="size-6" /></div>
              ) : (
                <>
                  {userBusinesses.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Businesses</p>
                      <div className="flex flex-col gap-2">
                        {userBusinesses.map((b) => (
                          <div key={b.id} className="flex items-center justify-between rounded-lg border p-2 text-sm">
                            <span>{b.business_name}</span>
                            <Badge variant="outline">{b.kyc_status_display}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {userTxns.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Recent Transactions</p>
                      <div className="flex flex-col gap-2">
                        {userTxns.slice(0, 10).map((t) => (
                          <div key={t.id} className="flex items-center justify-between rounded-lg border p-2 text-sm">
                            <span className="font-mono text-xs">{t.reference}</span>
                            <span>TZS {Number(t.amount).toLocaleString()}</span>
                            <Badge variant={t.status === "SUCCESS" ? "default" : t.status === "FAILED" ? "destructive" : "secondary"}>
                              {t.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminShell>
  )
}
