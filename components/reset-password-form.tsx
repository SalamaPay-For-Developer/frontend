"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { authApi, ApiError } from "@/lib/api"

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) return
    if (password !== confirmPassword) return

    const phone_number = typeof window !== "undefined" ? localStorage.getItem("reset_phone") : null
    if (!phone_number) {
      setError("Phone number not found. Please request reset again.")
      router.push("/auth/forgot-password")
      return
    }

    setError("")
    setSuccess("")
    setIsLoading(true)
    try {
      await authApi.resetPassword(phone_number, password)
      localStorage.removeItem("reset_phone")
      setSuccess("Password reset successfully! Redirecting to login...")
      setTimeout(() => {
        router.push("/auth/login")
      }, 1500)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.data?.detail as string || err.message)
      } else {
        setError("Failed to reset password. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your new password below.
          </p>
        </div>
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-500">
            {success}
          </div>
        )}
        <Field>
          <FieldLabel htmlFor="password">New Password</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {password.length > 0 && password.length < 6 && (
            <p className="mt-1 text-[10px] text-destructive font-medium">
              Password must be at least 6 characters
            </p>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {confirmPassword.length > 0 && password !== confirmPassword && (
            <p className="mt-1 text-[10px] text-destructive font-medium">
              Passwords do not match
            </p>
          )}
        </Field>
        <Field>
          <Button
            type="submit"
            disabled={isLoading || password.length < 6 || password !== confirmPassword}
          >
            {isLoading && <Spinner data-icon="inline-start" />}
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Remember your password?{" "}
            <Link href="/auth/login" className="underline underline-offset-4">
              Back to Login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
