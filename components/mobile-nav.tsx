"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface MobileNavProps {
  onClose: () => void
  isLoggedIn: boolean
  userRole: string | null
}

export function MobileNav({ onClose, isLoggedIn, userRole }: MobileNavProps) {
  return (
    <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden">
      <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2" onClick={onClose}>
            <span className="font-bold">Football Field Booking</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          <Link
            href="/fields"
            className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
            onClick={onClose}
          >
            Fields
          </Link>
          {isLoggedIn && userRole === "player" && (
            <>
              <Link
                href="/bookings"
                className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
                onClick={onClose}
              >
                My Bookings
              </Link>
              <Link
                href="/profile"
                className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
                onClick={onClose}
              >
                Profile
              </Link>
              <Link
                href="/friends"
                className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
                onClick={onClose}
              >
                Friends
              </Link>
              <Link
                href="/chat"
                className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
                onClick={onClose}
              >
                Chat
              </Link>
              <Link
                href="/teams"
                className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
                onClick={onClose}
              >
                Teams
              </Link>
              <Link
                href="/schedule"
                className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
                onClick={onClose}
              >
                Schedule
              </Link>
            </>
          )}
          {isLoggedIn && userRole === "owner" && (
            <Link
              href="/admin/fields"
              className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
              onClick={onClose}
            >
              Manage Fields
            </Link>
          )}
          {!isLoggedIn ? (
            <div className="flex flex-col gap-2 mt-4">
              <Button variant="outline" asChild>
                <Link href="/login/player" onClick={onClose}>
                  Player Login
                </Link>
              </Button>
              <Button asChild>
                <Link href="/login/owner" onClick={onClose}>
                  Owner Login
                </Link>
              </Button>
            </div>
          ) : (
            <Link
              href="/logout"
              className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
              onClick={onClose}
            >
              Logout
            </Link>
          )}
        </nav>
      </div>
    </div>
  )
}
