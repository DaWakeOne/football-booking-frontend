"use client"

import Link from "next/link"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const { user, userRole } = useAuth()

  return (
    <header className="bg-white border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            ActiModo
          </Link>
          {user && (
            <nav className="hidden md:flex gap-6">
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
                </>
              )}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.email?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                {userRole === "player" && (
                  <DropdownMenuItem asChild>
                    <Link href="/bookings">My Bookings</Link>
                  </DropdownMenuItem>
                )}
                {userRole === "owner" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/fields">My Fields</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/logout">Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
