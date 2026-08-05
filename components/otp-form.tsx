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
import { useAuth } from "@/lib/auth-context"

export function OTPForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState("")
  const [error, setError] = useState("")
  const { refreshUser } = useAuth()
  const router = useRouter()

  const handleSubmit = async () => {
    if (value.length !== 6) return

    setError("")
    setIsLoading(true)
    try {
      // OTP verification endpoint will be added to backend later
      // For now, just refresh user and proceed
      await refreshUser()
      router.push("/dashboard")
    } catch {
      setError("Verification failed. Please try again.")
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
        <Field className="flex flex-col items-center gap-4">
          <FieldLabel>One-Time Password</FieldLabel>
          <InputOTP
            maxLength={6}
            value={value}
            onChange={(val) => setValue(val)}
            onComplete={handleSubmit}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="size-12 text-lg" />
              <InputOTPSlot index={1} className="size-12 text-lg" />
              <InputOTPSlot index={2} className="size-12 text-lg" />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} className="size-12 text-lg" />
              <InputOTPSlot index={4} className="size-12 text-lg" />
              <InputOTPSlot index={5} className="size-12 text-lg" />
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
            <button className="text-primary underline underline-offset-4 hover:opacity-80">
              Resend Code
            </button>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  )
}
