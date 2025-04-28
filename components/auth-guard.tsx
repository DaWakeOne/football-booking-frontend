"use client"

import type React from "react"

import { useAuth } from "@/components/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import type { UserRole } from "@/lib/database.types"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, userRole, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user) {
      // Store the current path to redirect back after login
      sessionStorage.setItem("redirectAfterLogin", pathname)
      router.push("/login")
    } else if (!isLoading && user && requiredRole && userRole !== requiredRole) {
      // User is logged in but doesn't have the required role
      router.push("/unauthorized")
    }
  }, [user, userRole, isLoading, router, pathname, requiredRole])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
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
