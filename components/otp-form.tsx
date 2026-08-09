"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp"
import { Spinner } from "@/components/ui/spinner"
import { authApi, ApiError } from "@/lib/api"

export function OTPForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [value, setValue] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleResend = async () => {
    const phone_number = typeof window !== "undefined" ? localStorage.getItem("registered_phone") : null
    if (!phone_number) {
      setError("Phone number not found. Please register again.")
      return
    }

    setError("")
    setSuccess("")
    setIsResending(true)
    try {
      await authApi.resendOtp(phone_number)
      setSuccess("New OTP code sent to your phone.")
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.data?.detail as string || err.message)
      } else {
        setError("Failed to resend OTP. Please try again.")
      }
    } finally {
      setIsResending(false)
    }
  }

  const handleSubmit = async () => {
    if (value.length !== 6) return

    const phone_number = typeof window !== "undefined" ? localStorage.getItem("registered_phone") : null
    if (!phone_number) {
      setError("Phone number not found. Please register again.")
      router.push("/auth/register")
      return
    }

    setError("")
    setSuccess("")
    setIsLoading(true)
    try {
      await authApi.verifyOtp(phone_number, value)
      setSuccess("Account verified successfully! Redirecting to login...")
      localStorage.removeItem("registered_phone")
      setTimeout(() => {
        router.push("/auth/login")
      }, 1500)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Verification failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Verify Your Identity</h1>
          <p className="text-sm text-balance text-muted-foreground">
            We&apos;ve sent a 6-digit code to your phone. Enter it below to continue.
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
        <Field className="flex flex-col items-center gap-4">
          <FieldLabel>One-Time Password</FieldLabel>
          <InputOTP
            maxLength={6}
            value={value}
            onChange={(val) => setValue(val)}
            onComplete={handleSubmit}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="size-10 text-base sm:size-12 sm:text-lg" />
              <InputOTPSlot index={1} className="size-10 text-base sm:size-12 sm:text-lg" />
              <InputOTPSlot index={2} className="size-10 text-base sm:size-12 sm:text-lg" />
            </InputOTPGroup>
            <InputOTPSeparator className="hidden sm:flex" />
            <InputOTPGroup>
              <InputOTPSlot index={3} className="size-10 text-base sm:size-12 sm:text-lg" />
              <InputOTPSlot index={4} className="size-10 text-base sm:size-12 sm:text-lg" />
              <InputOTPSlot index={5} className="size-10 text-base sm:size-12 sm:text-lg" />
            </InputOTPGroup>
          </InputOTP>
        </Field>

        <Field>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || value.length !== 6}
            className="w-full"
          >
            {isLoading && <Spinner data-icon="inline-start" />}
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center">
            Didn&apos;t receive the code?{" "}
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-primary underline underline-offset-4 hover:opacity-80 disabled:opacity-50"
            >
              {isResending ? "Sending..." : "Resend Code"}
            </button>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  )
}
