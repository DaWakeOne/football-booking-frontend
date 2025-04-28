"use client"

import Link from "next/link"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function MobileNav() {
  const { user, userRole } = useAuth()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="flex flex-col gap-4 py-4">
          <Link href="/" className="text-xl font-bold">
            ActiModo
          </Link>
          <div className="flex flex-col gap-2">
            {user ? (
              <>
                {userRole === "player" && (
                  <>
                    <Link href="/fields" className="text-sm font-medium">
                      Fields
                    </Link>
                    <Link href="/bookings" className="text-sm font-medium">
                      My Bookings
                    </Link>
                    <Link href="/schedule" className="text-sm font-medium">
                      Schedule
                    </Link>
                    <Link href="/friends" className="text-sm font-medium">
                      Friends
                    </Link>
                    <Link href="/chat" className="text-sm font-medium">
                      Chat
                    </Link>
                    <Link href="/teams" className="text-sm font-medium">
                      Teams
                    </Link>
                    <Link href="/offers" className="text-sm font-medium">
                      Offers
                    </Link>
                    <Link href="/profile" className="text-sm font-medium">
                      Profile
                    </Link>
                  </>
                )}
                {userRole === "owner" && (
                  <>
                    <Link href="/admin/fields" className="text-sm font-medium">
                      My Fields
                    </Link>
                    <Link href="/admin/bookings" className="text-sm font-medium">
                      Bookings
                    </Link>
                    <Link href="/profile" className="text-sm font-medium">
                      Profile
                    </Link>
                  </>
                )}
                <Link href="/logout" className="text-sm font-medium">
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium">
                  Login
                </Link>
                <Link href="/signup" className="text-sm font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
