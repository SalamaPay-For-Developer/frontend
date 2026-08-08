import { useRouter } from "next/navigation"
import { useState } from "react"
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

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    const fullPhone = phone.startsWith("+255") ? phone : `+255${phone.replace(/^0/, "")}`
    setIsLoading(true)
    try {
      await authApi.forgotPassword(fullPhone)
      localStorage.setItem("reset_phone", fullPhone)
      setSuccess("Reset instructions sent. You can now reset your password.")
      setTimeout(() => {
        router.push("/auth/reset-password")
      }, 1500)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.data?.detail as string || err.message)
      } else {
        setError("Failed to send reset code. Please try again.")
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
          <h1 className="text-2xl font-bold">Forgot Password?</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your phone number below to receive instructions to reset your password.
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
          <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
          <Input
            id="phone"
            type="tel"
            placeholder="712 345 678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </Field>
        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Spinner data-icon="inline-start" />}
            {isLoading ? "Sending..." : "Send Request"}
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
