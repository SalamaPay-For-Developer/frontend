"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { savingsApi } from "@/lib/api"
import type { SavingsGoal } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ChartRingIcon,
  PlusSignIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons"

export default function SavingsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState("")
  const [target, setTarget] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await savingsApi.list()
        setGoals(data)
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }
    fetchGoals()
  }, [])

  const handleCreate = async () => {
    if (!title.trim() || !target) {
      setError("Please fill all fields")
      return
    }
    setSubmitting(true)
    setError("")
    try {
      const goal = await savingsApi.create({ title, target_amount: target })
      setGoals([...goals, goal])
      setShowCreate(false)
      setTitle("")
      setTarget("")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create goal"
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeposit = async (id: string, amount: string) => {
    try {
      const updated = await savingsApi.deposit(id, amount)
      setGoals(goals.map((g) => (g.id === id ? updated : g)))
    } catch {
      // ignore
    }
  }

  const handleWithdraw = async (id: string, amount: string) => {
    try {
      const updated = await savingsApi.withdraw(id, amount)
      setGoals(goals.map((g) => (g.id === id ? updated : g)))
    } catch {
      // ignore
    }
  }

  const totalSaved = goals.reduce((sum, g) => sum + Number(g.current_amount), 0)
  const totalTarget = goals.reduce((sum, g) => sum + Number(g.target_amount), 0)

  return (
    <DashboardShell breadcrumb="Savings">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Savings (Akiba)</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Set savings goals and track your progress.</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          New Goal
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-primary text-primary-foreground border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
            <HugeiconsIcon icon={ChartRingIcon} className="size-4 opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">TZS {totalSaved.toLocaleString()}</div>
            <p className="text-xs opacity-70 mt-1">Across {goals.length} goal(s)</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm dark:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Target</CardTitle>
            <HugeiconsIcon icon={ChartRingIcon} className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">TZS {totalTarget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalTarget > 0 ? `${Math.round((totalSaved / totalTarget) * 100)}% complete` : "No targets set"}
            </p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><Spinner className="size-8" /></div>
      ) : goals.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
            <HugeiconsIcon icon={ChartRingIcon} className="size-12 text-muted-foreground" />
            <p className="text-muted-foreground">No savings goals yet. Start saving today!</p>
            <Button onClick={() => setShowCreate(true)}>
              <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
              Create Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {goals.map((goal) => {
            const progress = goal.target_amount ? Math.min(100, (Number(goal.current_amount) / Number(goal.target_amount)) * 100) : 0
            return (
              <Card key={goal.id}>
                <CardContent className="flex flex-col gap-3 pt-6">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{goal.title}</p>
                    <Badge variant={goal.status === "COMPLETED" ? "default" : goal.status === "WITHDRAWN" ? "secondary" : "outline"}>
                      {goal.status === "COMPLETED" && <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-3 mr-1" />}
                      {goal.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">TZS {Number(goal.current_amount).toLocaleString()}</span>
                      <span className="text-muted-foreground">TZS {Number(goal.target_amount).toLocaleString()}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        const amt = prompt("Deposit amount:")
                        if (amt) handleDeposit(goal.id, amt)
                      }}
                    >
                      <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 text-green-500" />
                      Deposit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        const amt = prompt("Withdraw amount:")
                        if (amt) handleWithdraw(goal.id, amt)
                      }}
                    >
                      <HugeiconsIcon icon={ArrowUp01Icon} className="size-4 text-destructive" />
                      Withdraw
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Savings Goal</DialogTitle>
            <DialogDescription>Set a new savings target to work towards.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="goal-title">Goal Name</Label>
              <Input id="goal-title" placeholder="e.g. New Car, School Fees" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="goal-target">Target Amount (TZS)</Label>
              <Input id="goal-target" type="number" placeholder="500000" value={target} onChange={(e) => setTarget(e.target.value)} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={handleCreate} disabled={submitting}>
              {submitting ? <Spinner className="size-4" /> : <HugeiconsIcon icon={PlusSignIcon} className="size-4" />}
              Create Goal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
