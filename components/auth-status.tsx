"use client"

import { useEffect, useState } from "react"
import { isAuthenticated, getUserRole, getAuthData } from "@/lib/auth-utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AuthStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      const role = getUserRole()
      const user = getAuthData()

      setIsLoggedIn(authenticated)
      setUserRole(role)
      setUserData(user)
    }

    checkAuth()

    // Check when window is focused
    window.addEventListener("focus", checkAuth)

    return () => {
      window.removeEventListener("focus", checkAuth)
    }
  }, [])

  if (!isLoggedIn) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href="/login/player">Login</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/auth-debug">Debug Auth</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span>
        Logged in as <strong>{userData?.email}</strong> ({userRole})
      </span>
      <Button asChild size="sm" variant="outline">
        <Link href="/logout">Logout</Link>
      </Button>
    </div>
  )
}
