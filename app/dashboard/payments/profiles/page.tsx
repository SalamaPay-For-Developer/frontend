"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PlusSignIcon,
  CreditCardIcon,
  Link02Icon,
  QrCode01Icon,
  PencilEdit01Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons"

interface PaymentProfile {
  id: string
  name: string
  payment_method: "MOBILE_MONEY" | "CARD" | "QR" | "BANK"
  phone?: string
  description?: string
  created_at: string
}

const METHOD_LABELS: Record<string, string> = {
  MOBILE_MONEY: "Mobile Money",
  CARD: "Card",
  QR: "QR Code",
  BANK: "Bank Transfer",
}

const METHOD_ICONS: Record<string, typeof CreditCardIcon> = {
  MOBILE_MONEY: CreditCardIcon,
  CARD: CreditCardIcon,
  QR: QrCode01Icon,
  BANK: CreditCardIcon,
}

export default function PaymentProfilesPage() {
  const router = useRouter()
  const [profiles, setProfiles] = useState<PaymentProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [method, setMethod] = useState("MOBILE_MONEY")
  const [phone, setPhone] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("payment_profiles")
    if (stored) {
      try {
        setProfiles(JSON.parse(stored))
      } catch {
        // ignore
      }
    }
    setIsLoading(false)
  }, [])

  const saveProfiles = (updated: PaymentProfile[]) => {
    setProfiles(updated)
    localStorage.setItem("payment_profiles", JSON.stringify(updated))
  }

  const handleSave = () => {
    if (!name.trim()) {
      setError("Profile name is required")
      return
    }
    if (editingId) {
      const updated = profiles.map((p) =>
        p.id === editingId
          ? { ...p, name: name.trim(), payment_method: method as PaymentProfile["payment_method"], phone: phone.trim() || undefined, description: description.trim() || undefined }
          : p
      )
      saveProfiles(updated)
    } else {
      const profile: PaymentProfile = {
        id: `profile_${Date.now()}`,
        name: name.trim(),
        payment_method: method as PaymentProfile["payment_method"],
        phone: phone.trim() || undefined,
        description: description.trim() || undefined,
        created_at: new Date().toISOString(),
      }
      saveProfiles([...profiles, profile])
    }
    resetForm()
  }

  const handleEdit = (profile: PaymentProfile) => {
    setEditingId(profile.id)
    setName(profile.name)
    setMethod(profile.payment_method)
    setPhone(profile.phone || "")
    setDescription(profile.description || "")
    setShowCreate(true)
  }

  const handleDelete = (id: string) => {
    saveProfiles(profiles.filter((p) => p.id !== id))
  }

  const resetForm = () => {
    setEditingId(null)
    setName("")
    setMethod("MOBILE_MONEY")
    setPhone("")
    setDescription("")
    setError("")
    setShowCreate(false)
  }

  return (
    <DashboardShell breadcrumb="Payment Profiles">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Payment Profiles</h1>
          <p className="text-muted-foreground">Manage profiles used for generating payment links.</p>
        </div>
        <Button size="sm" onClick={() => { resetForm(); setShowCreate(true) }}>
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          New Profile
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profiles ({profiles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="size-6" />
            </div>
          ) : profiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <HugeiconsIcon icon={Link02Icon} className="size-12 text-muted-foreground/30" />
              <p className="text-muted-foreground">No payment profiles yet.</p>
              <Button size="sm" variant="outline" onClick={() => setShowCreate(true)}>
                <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
                Create your first profile
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">{profile.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex size-6 items-center justify-center rounded-full bg-primary/10">
                          <HugeiconsIcon icon={METHOD_ICONS[profile.payment_method] || CreditCardIcon} className="size-3 text-primary" />
                        </div>
                        <Badge variant="outline">{METHOD_LABELS[profile.payment_method] || profile.payment_method}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{profile.phone || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{profile.description || "—"}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(profile.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(profile)}>
                          <HugeiconsIcon icon={PencilEdit01Icon} className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(profile.id)}>
                          <HugeiconsIcon icon={Delete01Icon} className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => router.push("/dashboard/payments")}>
          Back to Payments
        </Button>
      </div>

      {/* Create / Edit Profile Dialog */}
      <Dialog open={showCreate} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Profile" : "Create Payment Profile"}</DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update your payment profile details."
                : "Create a profile to use with payment links."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label>Profile Name</Label>
              <Input
                placeholder="e.g. Main Shop, Online Store"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Payment Method</Label>
              <Select value={method} onValueChange={(v) => setMethod(v || "MOBILE_MONEY")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MOBILE_MONEY">Mobile Money (Phone)</SelectItem>
                  <SelectItem value="CARD">Card</SelectItem>
                  <SelectItem value="QR">QR Code</SelectItem>
                  <SelectItem value="BANK">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(method === "MOBILE_MONEY" || method === "QR") && (
              <div className="flex flex-col gap-2">
                <Label>Phone Number (optional)</Label>
                <Input
                  placeholder="2557XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label>Description (optional)</Label>
              <Input
                placeholder="e.g. For online orders"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => resetForm()}>Cancel</Button>
            <Button onClick={handleSave}>
              <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
              {editingId ? "Save Changes" : "Create Profile"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
