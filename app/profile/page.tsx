"use client"

import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, userRole, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  return (
    <AuthGuard>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">Email:</p>
              <p>{user?.email}</p>
            </div>
            <div>
              <p className="font-medium">Role:</p>
              <p className="capitalize">{userRole}</p>
            </div>
            <div>
              <p className="font-medium">User ID:</p>
              <p className="text-sm text-muted-foreground">{user?.id}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" onClick={handleSignOut}>
              Sign Out
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AuthGuard>
  )
}
