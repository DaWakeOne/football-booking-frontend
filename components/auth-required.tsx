"use client"

import { useEffect, useState } from "react"
import { isAuthenticated, getUserRole } from "@/lib/auth-utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { UserRole } from "@/lib/database.types"

interface AuthRequiredProps {
  requiredRole?: UserRole
}

export function AuthRequired({ requiredRole }: AuthRequiredProps) {
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const authenticated = isAuthenticated()
    const userRole = getUserRole()

    // If no role is required, just check if authenticated
    if (!requiredRole) {
      setIsAuthorized(authenticated)
    } else {
      // Check if user has the required role
      setIsAuthorized(authenticated && userRole === requiredRole)
    }
  }, [requiredRole])

  if (isAuthorized) {
    return null
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
      </AlertDescription>
    </Alert>
  )
}
