"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { Loader2 } from "lucide-react"
import type { UserRole } from "@/lib/database.types"

interface AuthCheckProps {
  children: React.ReactNode
  requiredRole?: UserRole
  redirectTo?: string
}

export function AuthCheck({ children, requiredRole, redirectTo = "/login" }: AuthCheckProps) {
  const { user, isLoading, userRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(redirectTo)
    } else if (!isLoading && user && requiredRole && userRole !== requiredRole) {
      router.push("/unauthorized")
    }
  }, [user, isLoading, router, redirectTo, requiredRole, userRole])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredRole && userRole !== requiredRole) {
    return null
  }

  return <>{children}</>
}
