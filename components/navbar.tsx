"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserNav } from "./user-nav"
import { MobileNav } from "./mobile-nav"
import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { isAuthenticated, getUserRole, getAuthData } from "@/lib/auth-utils"

export function Navbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)

  // Check auth status on mount and when window is focused
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

    // Also check when the window is focused
    window.addEventListener("focus", checkAuth)

    return () => {
      window.removeEventListener("focus", checkAuth)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block">ActiModo</span>
        </Link>
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/fields" className="transition-colors hover:text-foreground/80">
              Fields
            </Link>
            {isLoggedIn && userRole === "player" && (
              <>
                <Link href="/bookings" className="transition-colors hover:text-foreground/80">
                  My Bookings
                </Link>
                <Link href="/friends" className="transition-colors hover:text-foreground/80">
                  Friends
                </Link>
                <Link href="/chat" className="transition-colors hover:text-foreground/80">
                  Chat
                </Link>
                <Link href="/teams" className="transition-colors hover:text-foreground/80">
                  Teams
                </Link>
                <Link href="/schedule" className="transition-colors hover:text-foreground/80">
                  Schedule
                </Link>
              </>
            )}
            {isLoggedIn && userRole === "owner" && (
              <Link href="/admin/fields" className="transition-colors hover:text-foreground/80">
                Manage Fields
              </Link>
            )}
          </nav>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <UserNav user={userData} />
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/login/player">Player Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/login/owner">Owner Login</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileNavOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      {mobileNavOpen && (
        <MobileNav onClose={() => setMobileNavOpen(false)} isLoggedIn={isLoggedIn} userRole={userRole} />
      )}
    </header>
  )
}
