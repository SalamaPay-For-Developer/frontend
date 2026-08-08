"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { HugeiconsIcon } from "@hugeicons/react"
import { ViewIcon, ViewOffIcon, SmartPhone01Icon } from "@hugeicons/core-free-icons"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Progress,
  ProgressTrack,
  ProgressIndicator,
} from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import { ApiError } from "@/lib/api"
import Link from "next/link"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const { register } = useAuth()
  const router = useRouter()

  const passwordStrength = useMemo(() => {
    if (password.length === 0) return 0
    if (password.length < 6) return 25
    
    let strength = 50
    if (/[A-Z]/.test(password)) strength += 15
    if (/[0-9]/.test(password)) strength += 15
    if (/[^A-Za-z0-9]/.test(password)) strength += 20
    return Math.min(strength, 100)
  }, [password])

  const strengthColor = useMemo(() => {
    if (passwordStrength <= 25) return "bg-destructive"
    if (passwordStrength <= 50) return "bg-orange-500"
    if (passwordStrength <= 75) return "bg-yellow-500"
    return "bg-green-500"
  }, [passwordStrength])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) return
    if (password !== confirmPassword) return
    
    setError("")
    const fullPhone = phone.startsWith("+255") ? phone : `+255${phone.replace(/^0/, "")}`
    setIsLoading(true)
    try {
      await register({
        phone_number: fullPhone,
        full_name: fullName,
        password,
        email: email || undefined,
      })
      localStorage.setItem("registered_phone", fullPhone)
      router.push("/auth/otp")
    } catch (err) {
      if (err instanceof ApiError) {
        const data = err.data as Record<string, unknown>
        const detail = data?.detail
        const msg = typeof detail === "string" ? detail : Object.values(data).flat().join(", ") || err.message
        setError(msg)
      } else {
        setError("Registration failed. Please try again.")
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
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your details below to create your account
          </p>
        </div>
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="Amina Juma"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email Address (Optional)</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="aminajuma@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="mobile">Mobile Number</FieldLabel>
          <InputGroup>
            <InputGroupAddon align="inline-start" className="px-3">
              <InputGroupText>+255</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="mobile"
              type="tel"
              placeholder="712 345 678"
              pattern="[0-9]*"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <InputGroupAddon align="inline-end" className="px-3">
              <HugeiconsIcon icon={SmartPhone01Icon} className="size-4 text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <InputGroupButton
              size="icon-sm"
              onClick={() => setShowPassword(!showPassword)}
            >
              <HugeiconsIcon
                icon={showPassword ? ViewOffIcon : ViewIcon}
                className="size-4"
              />
            </InputGroupButton>
          </InputGroup>
          {password.length > 0 && (
            <div className="mt-2 space-y-1.5">
              <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold">
                <span className="text-muted-foreground">Strength</span>
                <span className={cn(
                  passwordStrength <= 25 ? "text-destructive" :
                  passwordStrength <= 50 ? "text-orange-500" :
                  passwordStrength <= 75 ? "text-yellow-500" : "text-green-500"
                )}>
                  {passwordStrength <= 25 ? "Weak" :
                   passwordStrength <= 50 ? "Fair" :
                   passwordStrength <= 75 ? "Good" : "Strong"}
                </span>
              </div>
              <Progress value={passwordStrength} className="h-1 flex-col gap-0">
                <ProgressTrack>
                  <ProgressIndicator className={strengthColor} />
                </ProgressTrack>
              </Progress>
              {password.length < 6 && (
                <p className="text-[10px] text-destructive font-medium">
                  Password must be at least 6 characters
                </p>
              )}
            </div>
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
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button variant="outline" type="button" className="w-full relative" disabled>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="mr-2 size-4">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            Continue with Google
            <span className="absolute -top-1.5 -right-1 bg-primary text-[8px] text-primary-foreground px-1 py-0.5 rounded-full font-bold uppercase tracking-tight shadow-sm leading-none">
              Coming Soon
            </span>
          </Button>
          <FieldDescription className="text-center">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline underline-offset-4">
              Login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
