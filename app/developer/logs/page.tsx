"use client"

import { useState, useEffect } from "react"
import { DeveloperShell } from "@/components/developer-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { developerApi } from "@/lib/api"
import type { ApiLog } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CodeIcon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { useMemo } from "react"

export default function ApiLogsPage() {
  const [logs, setLogs] = useState<ApiLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [selectedLog, setSelectedLog] = useState<ApiLog | null>(null)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await developerApi.logs()
        setLogs(data)
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }
    fetchLogs()
  }, [])

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch = !search ||
        log.endpoint.toLowerCase().includes(search.toLowerCase()) ||
        log.method.toLowerCase().includes(search.toLowerCase()) ||
        (log.transaction_ref?.toLowerCase().includes(search.toLowerCase()) ?? false)
      const matchesStatus = statusFilter === "ALL" ||
        (statusFilter === "SUCCESS" && log.is_success) ||
        (statusFilter === "FAILED" && !log.is_success)
      return matchesSearch && matchesStatus
    })
  }, [logs, search, statusFilter])

  return (
    <DeveloperShell breadcrumb="API Logs">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">API Logs</h1>
        <p className="text-muted-foreground">Monitor API requests and responses. Sensitive data is redacted.</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by endpoint, method, or transaction..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {["ALL", "SUCCESS", "FAILED"].map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      <Card className="border-none shadow-sm dark:bg-muted/50">
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8"><Spinner className="size-6" /></div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <HugeiconsIcon icon={CodeIcon} className="size-12 text-muted-foreground" />
              <p className="text-muted-foreground">No API logs found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Method</TableHead>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.slice(0, 50).map((log) => (
                  <TableRow
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="cursor-pointer"
                  >
                    <TableCell>
                      <Badge variant="outline">{log.method}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{log.endpoint}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon
                          icon={log.is_success ? CheckmarkCircle01Icon : Cancel01Icon}
                          className={`size-4 ${log.is_success ? "text-green-500" : "text-destructive"}`}
                        />
                        <span className="text-sm">{log.response_status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{log.duration_ms}ms</TableCell>
                    <TableCell className="font-mono text-xs">{log.transaction_ref || "—"}</TableCell>
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

      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>API Log Detail</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Method: </span>
                  <Badge variant="outline">{selectedLog.method}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Status: </span>
                  <span className={selectedLog.is_success ? "text-green-500" : "text-destructive"}>
                    {selectedLog.response_status}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration: </span>
                  <span>{selectedLog.duration_ms}ms</span>
                </div>
                <div>
                  <span className="text-muted-foreground">IP: </span>
                  <span className="font-mono text-xs">{selectedLog.ip_address || "—"}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Endpoint</p>
                <code className="text-sm font-mono bg-muted p-2 rounded block">{selectedLog.endpoint}</code>
              </div>
              {selectedLog.request_body && (
                <div>
                  <p className="text-sm font-medium mb-1">Request Body</p>
                  <pre className="text-xs font-mono bg-muted p-3 rounded overflow-auto max-h-40">
                    {JSON.stringify(selectedLog.request_body, null, 2)}
                  </pre>
                </div>
              )}
              {selectedLog.response_body && (
                <div>
                  <p className="text-sm font-medium mb-1">Response Body</p>
                  <pre className="text-xs font-mono bg-muted p-3 rounded overflow-auto max-h-40">
                    {JSON.stringify(selectedLog.response_body, null, 2)}
                  </pre>
                </div>
              )}
              {selectedLog.request_headers && Object.keys(selectedLog.request_headers).length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-1">Request Headers (redacted)</p>
                  <pre className="text-xs font-mono bg-muted p-3 rounded overflow-auto max-h-40">
                    {JSON.stringify(selectedLog.request_headers, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DeveloperShell>
  )
}
