"use client"

import { useEffect } from "react"
import { clearAuthData } from "@/lib/auth-utils"
import { Loader2 } from "lucide-react"

export default function LogoutPage() {
  useEffect(() => {
    const logout = async () => {
      // Clear auth data
      clearAuthData()

      // Redirect to home page with a full page refresh
      window.location.href = "/"
    }

    logout()
  }, [])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Logging out...</p>
      </div>
    </div>
  )
}
