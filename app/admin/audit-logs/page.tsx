"use client"

import { useState, useEffect } from "react"
import { AdminShell } from "@/components/admin-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { adminApi } from "@/lib/api"
import type { AuditLog } from "@/lib/types"

const ACTION_BADGE: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  CREATE: "default",
  UPDATE: "secondary",
  DELETE: "destructive",
  APPROVE: "default",
  REJECT: "destructive",
  SUSPEND: "destructive",
  ACTIVATE: "default",
  LOGIN: "outline",
  LOGOUT: "outline",
  EXPORT: "secondary",
  OTHER: "outline",
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [moduleFilter, setModuleFilter] = useState("ALL")

  useEffect(() => { fetchLogs() }, [])

  const fetchLogs = async () => {
    setIsLoading(true)
    try {
      const params: Record<string, string> = {}
      if (moduleFilter !== "ALL") params.module = moduleFilter
      setLogs(await adminApi.auditLogs(params))
    } catch { /* ignore */ } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminShell breadcrumb="Audit Logs">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">Track all critical actions in the system.</p>
      </div>

      <div className="flex gap-2">
        <Select value={moduleFilter} onValueChange={(v: string | null) => { if (v) { setModuleFilter(v); setTimeout(fetchLogs, 0) } }}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Filter by module" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Modules</SelectItem>
            <SelectItem value="users">Users</SelectItem>
            <SelectItem value="businesses">Businesses</SelectItem>
            <SelectItem value="fees">Fees</SelectItem>
            <SelectItem value="refunds">Refunds</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="transactions">Transactions</SelectItem>
            <SelectItem value="notifications">Notifications</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={fetchLogs}>Refresh</Button>
      </div>

      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8"><Spinner className="size-6" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.slice(0, 100).map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.actor_name}</TableCell>
                    <TableCell>
                      <Badge variant={ACTION_BADGE[log.action] || "outline"}>{log.action}</Badge>
                    </TableCell>
                    <TableCell><Badge variant="outline">{log.module}</Badge></TableCell>
                    <TableCell className="text-sm max-w-[300px] truncate">{log.description}</TableCell>
                    <TableCell className="font-mono text-xs">{log.ip_address || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
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
