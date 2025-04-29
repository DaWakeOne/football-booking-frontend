"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-context"
import Link from "next/link"

export function PlayerRightSidebar() {
  const { user } = useAuth()

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button asChild className="w-full justify-start" variant="ghost">
            <Link href="/fields">
              <span>Find a Field</span>
            </Link>
          </Button>
          <Button asChild className="w-full justify-start" variant="ghost">
            <Link href="/schedule">
              <span>Update Schedule</span>
            </Link>
          </Button>
          <Button asChild className="w-full justify-start" variant="ghost">
            <Link href="/friends">
              <span>Add Friends</span>
            </Link>
          </Button>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href="/profile">View Profile</Link>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Upcoming Bookings</CardTitle>
          <CardDescription>Your next scheduled games</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No upcoming bookings</p>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href="/bookings">View All Bookings</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
