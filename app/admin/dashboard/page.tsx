"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OwnerDashboard() {
  const { user, userRole, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || userRole !== "owner")) {
      router.push("/unauthorized")
    }
  }, [user, userRole, isLoading, router])

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || userRole !== "owner") {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Owner Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create a Field</CardTitle>
            <CardDescription>Add a new football field to your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/admin/fields/new")} className="w-full">
              Create Field
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Fields</CardTitle>
            <CardDescription>Manage your existing football fields</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/admin/fields")} className="w-full">
              View Fields
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/admin/profile")} className="w-full">
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
