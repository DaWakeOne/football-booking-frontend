"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useAuth } from "@/components/auth-context"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const { user, userRole, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    setOpen(false)
  }

  const closeSheet = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>ActiModo</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-4">
          {user ? (
            <>
              {userRole === "player" ? (
                <>
                  <Link href="/fields" onClick={closeSheet} className="px-2 py-1 hover:underline">
                    Fields
                  </Link>
                  <Link href="/bookings" onClick={closeSheet} className="px-2 py-1 hover:underline">
                    My Bookings
                  </Link>
                  <Link href="/schedule" onClick={closeSheet} className="px-2 py-1 hover:underline">
                    Schedule
                  </Link>
                  <Link href="/friends" onClick={closeSheet} className="px-2 py-1 hover:underline">
                    Friends
                  </Link>
                  <Link href="/chat" onClick={closeSheet} className="px-2 py-1 hover:underline">
                    Chat
                  </Link>
                  <Link href="/teams" onClick={closeSheet} className="px-2 py-1 hover:underline">
                    Teams
                  </Link>
                  <Link href="/offers" onClick={closeSheet} className="px-2 py-1 hover:underline">
                    Offers
                  </Link>
                  <Link href="/profile" onClick={closeSheet} className="px-2 py-1 hover:underline">
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/admin/fields" onClick={closeSheet} className="px-2 py-1 hover:underline">
                    My Fields
                  </Link>
                  <Link href="/admin/bookings" onClick={closeSheet} className="px-2 py-1 hover:underline">
                    Bookings
                  </Link>
                </>
              )}
              <Button variant="ghost" onClick={handleSignOut} className="justify-start px-2">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login/player" onClick={closeSheet} className="px-2 py-1 hover:underline">
                Player Login
              </Link>
              <Link href="/login/owner" onClick={closeSheet} className="px-2 py-1 hover:underline">
                Owner Login
              </Link>
              <Link href="/signup/player" onClick={closeSheet} className="px-2 py-1 hover:underline">
                Player Sign Up
              </Link>
              <Link href="/signup/owner" onClick={closeSheet} className="px-2 py-1 hover:underline">
                Owner Sign Up
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
