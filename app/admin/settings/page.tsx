"use client"

import { useState, useEffect } from "react"
import { AdminShell } from "@/components/admin-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Separator } from "@/components/ui/separator"
import { adminApi } from "@/lib/api"
import type { SystemSetting } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { Settings05Icon, SaveIcon } from "@hugeicons/core-free-icons"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSettings(await adminApi.settings())
      } catch { /* ignore */ } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSave = async (id: string) => {
    try {
      let parsedValue: Record<string, unknown>
      try {
        parsedValue = JSON.parse(editValue)
      } catch {
        parsedValue = { value: editValue }
      }
      const updated = await adminApi.updateSetting(id, { value: parsedValue })
      setSettings(settings.map((s) => s.id === updated.id ? updated : s))
      setEditingKey(null)
    } catch { /* ignore */ }
  }

  if (isLoading) {
    return (
      <AdminShell breadcrumb="Settings">
        <div className="flex items-center justify-center py-12"><Spinner className="size-8" /></div>
      </AdminShell>
    )
  }

  return (
    <AdminShell breadcrumb="Settings">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">Configure system-wide settings.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {settings.map((s) => (
          <Card key={s.id} className="border-none shadow-sm dark:bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <HugeiconsIcon icon={Settings05Icon} className="size-4" />
                  {s.key}
                </span>
                {s.is_public && <Badge variant="outline">Public</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {s.description && <p className="text-sm text-muted-foreground">{s.description}</p>}
              <Separator />
              {editingKey === s.id ? (
                <div className="flex flex-col gap-2">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSave(s.id)}>
                      <HugeiconsIcon icon={SaveIcon} className="size-4" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingKey(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <pre className="text-xs font-mono bg-muted p-2 rounded flex-1 overflow-auto max-h-20">
                    {JSON.stringify(s.value, null, 2)}
                  </pre>
                  <Button size="sm" variant="ghost" className="ml-2"
                    onClick={() => { setEditingKey(s.id); setEditValue(JSON.stringify(s.value)) }}>
                    Edit
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminShell>
  )
}
