"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserNavProps {
  user: {
    email: string
    role: string
  } | null
}

export function UserNav({ user }: UserNavProps) {
  const handleSignOut = () => {
    // Redirect to logout page
    window.location.href = "/logout"
  }

  if (!user) return null

  const initials = user.email ? user.email.substring(0, 2).toUpperCase() : "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.email}</p>
            <p className="text-xs text-muted-foreground">{user.role === "player" ? "Player" : "Field Owner"}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/profile">Profile</a>
        </DropdownMenuItem>
        {user.role === "player" && (
          <>
            <DropdownMenuItem asChild>
              <a href="/bookings">My Bookings</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/friends">Friends</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/chat">Chat</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/teams">Teams</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/schedule">Schedule</a>
            </DropdownMenuItem>
          </>
        )}
        {user.role === "owner" && (
          <DropdownMenuItem asChild>
            <a href="/admin/fields">Manage Fields</a>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
