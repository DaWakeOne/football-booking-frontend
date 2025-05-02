"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, ListIcon, UserIcon } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getUserRole } from "@/lib/auth-utils"

export function AdminDashboardClient() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated and has the correct role
    const role = getUserRole()
    if (!isLoading && (!user || role !== "owner")) {
      router.push("/login/owner")
    }
  }, [user, isLoading, router])

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Field Owner Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Create Field</CardTitle>
            <CardDescription>Add a new football field to your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create a detailed listing for your football field with all necessary information for players.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/admin/fields/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Field
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Fields</CardTitle>
            <CardDescription>Manage your existing football fields</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              View, edit, and manage all your football fields in one place.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/fields">
                <ListIcon className="mr-2 h-4 w-4" />
                View Fields
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your owner profile</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Update your personal information and account settings.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/profile">
                <UserIcon className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
