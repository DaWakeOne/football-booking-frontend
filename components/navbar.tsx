"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { UserNav } from "@/components/user-nav"
import { useAuth } from "@/components/auth-context"

export function Navbar() {
  const { user, userRole } = useAuth()

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            ActiModo
          </Link>
          {user && (
            <nav className="hidden md:flex items-center gap-6">
              {userRole === "player" ? (
                <>
                  <Link href="/fields" className="text-sm font-medium hover:underline">
                    Fields
                  </Link>
                  <Link href="/bookings" className="text-sm font-medium hover:underline">
                    My Bookings
                  </Link>
                  <Link href="/schedule" className="text-sm font-medium hover:underline">
                    Schedule
                  </Link>
                  <Link href="/friends" className="text-sm font-medium hover:underline">
                    Friends
                  </Link>
                  <Link href="/chat" className="text-sm font-medium hover:underline">
                    Chat
                  </Link>
                  <Link href="/teams" className="text-sm font-medium hover:underline">
                    Teams
                  </Link>
                  <Link href="/offers" className="text-sm font-medium hover:underline">
                    Offers
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/admin/fields" className="text-sm font-medium hover:underline">
                    My Fields
                  </Link>
                  <Link href="/admin/bookings" className="text-sm font-medium hover:underline">
                    Bookings
                  </Link>
                </>
              )}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <UserNav />
          ) : (
            <div className="hidden md:flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/login/player">Player Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/login/owner">Owner Login</Link>
              </Button>
            </div>
          )}
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
