"use client"

import { ForgotPasswordForm } from "@/components/forgot-password-form"
import { AuthSidePanel } from "@/components/auth-side-panel"

export default function ForgotPasswordPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center font-medium">
            <img src="/salamapaylogo.png" alt="Salamapay" className="size-24 object-contain" />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
      <AuthSidePanel />
    </div>
  )
}
