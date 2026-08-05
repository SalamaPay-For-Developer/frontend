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

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    router.push("/auth/otp")
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
            Enter your email below to receive instructions to reset your password.
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email Address</FieldLabel>
          <Input id="email" type="email" placeholder="aminajuma@gmail.com" required />
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
