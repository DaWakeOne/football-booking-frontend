"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { isAuthenticated, getUserRole, getAuthData } from "@/lib/auth-utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import type { UserRole } from "@/lib/database.types"

interface AuthCheckProps {
  children: React.ReactNode
  requiredRole?: UserRole
  fallback?: React.ReactNode
}

export function AuthCheck({ children, requiredRole, fallback }: AuthCheckProps) {
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [authData, setAuthData] = useState<any>(null)

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      const userRole = getUserRole()
      const userData = getAuthData()

      setAuthData(userData)

      // If no role is required, just check if authenticated
      if (!requiredRole) {
        setIsAuthorized(authenticated)
      } else {
        // Check if user has the required role
        setIsAuthorized(authenticated && userRole === requiredRole)
      }

      setIsChecking(false)
    }

    checkAuth()

    // Also check when the component is focused
    window.addEventListener("focus", checkAuth)

    return () => {
      window.removeEventListener("focus", checkAuth)
    }
  }, [requiredRole])

  if (isChecking) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthorized) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <Alert variant="destructive" className="my-4">
        <AlertTitle>Authentication Required</AlertTitle>
        <AlertDescription>
          <p className="mb-4">You need to be logged in to access this page.</p>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/login/player">Player Login</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login/owner">Owner Login</Link>
            </Button>
          </div>
          <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
            <pre>{JSON.stringify(authData, null, 2)}</pre>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return <>{children}</>
}
