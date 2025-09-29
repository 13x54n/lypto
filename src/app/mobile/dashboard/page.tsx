"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

export default function MobileDashboardPage() {
  const router = useRouter()

  React.useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) {
      router.replace('/mobile/auth')
    }
  }, [router])

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-xl font-semibold">Mobile Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">Welcome back. This is a simplified dashboard view for mobile.</p>
    </div>
  )
}


