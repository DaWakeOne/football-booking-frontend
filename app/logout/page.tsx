'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

function LogoutContent() {
  const { signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const performLogout = async () => {
      await signOut()
      router.push("/login")
    }

    performLogout()
  }, [signOut, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Logging out...</p>
      </div>
    </div>
  )
}

export default function LogoutPage() {
  return (
    <AuthProvider>
      <LogoutContent />
    </AuthProvider>
  )
}
