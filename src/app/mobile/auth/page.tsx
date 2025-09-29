"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiService } from "@/lib/api"

export default function MobileAuthPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [code, setCode] = React.useState("")
  const [step, setStep] = React.useState<'email' | 'otp'>("email")
  const [sending, setSending] = React.useState(false)
  const [verifying, setVerifying] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleRequest = async () => {
    try {
      setError(null)
      setSending(true)
      await apiService.requestOtp(email)
      setStep("otp")
    } catch (e: any) {
      setError(e?.message || "Failed to send code")
    } finally {
      setSending(false)
    }
  }

  const handleVerify = async () => {
    try {
      setError(null)
      setVerifying(true)
      const { token } = await apiService.verifyOtp(email, code)
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token)
      }
      router.replace("/mobile/dashboard")
    } catch (e: any) {
      setError(e?.message || "Invalid or expired code")
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-semibold text-center">Sign in</h1>
        <p className="mt-1 text-sm text-center text-muted-foreground">Enter your email to receive a one-time code.</p>

        {error && (
          <div className="mt-4 text-sm text-red-600">{error}</div>
        )}

        {step === "email" ? (
          <div className="mt-6 space-y-3">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button className="w-full" onClick={handleRequest} disabled={sending || !email}>
              {sending ? "Sending..." : "Send code"}
            </Button>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <Input
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            />
            <Button className="w-full" onClick={handleVerify} disabled={verifying || code.length !== 6}>
              {verifying ? "Verifying..." : "Verify & continue"}
            </Button>
            <Button variant="ghost" className="w-full" onClick={handleRequest} disabled={sending}>
              {sending ? "Resending..." : "Resend code"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}


