"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, ListFilter, User, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getUserRole } from "@/lib/auth-utils"

export default function OwnerDashboard() {
  const { user, isLoading, userRole } = useAuth()
  const router = useRouter()
  const [fieldsCount, setFieldsCount] = useState<number | null>(null)
  const [isLoadingFields, setIsLoadingFields] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasRequiredRole, setHasRequiredRole] = useState(false)

  useEffect(() => {
    // Check if user is authenticated and has the correct role
    if (!isLoading && user) {
      setIsAuthenticated(true)
      const role = getUserRole()
      setHasRequiredRole(role === "owner")
    } else if (!isLoading && !user) {
      setIsAuthenticated(false)
      setHasRequiredRole(false)
    }
  }, [user, isLoading])

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !hasRequiredRole)) {
      router.push("/login/owner")
    }
  }, [isAuthenticated, hasRequiredRole, isLoading, router])

  useEffect(() => {
    // Fetch fields count
    const fetchFieldsCount = async () => {
      try {
        const { supabase } = useAuth()
        const { data, error, count } = await supabase
          .from("fields")
          .select("id", { count: "exact" })
          .eq("owner_id", user?.id)

        if (error) throw error
        setFieldsCount(count || 0)
      } catch (err) {
        console.error("Error fetching fields count:", err)
        setFieldsCount(0)
      } finally {
        setIsLoadingFields(false)
      }
    }

    if (user?.id) {
      fetchFieldsCount()
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Field Owner Dashboard</h1>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>My Fields</CardTitle>
                <CardDescription>Manage your football fields</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingFields ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <p className="text-3xl font-bold">{fieldsCount}</p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/fields">
                    <ListFilter className="mr-2 h-4 w-4" />
                    View All Fields
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Profile</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{user?.email || "No email available"}</p>
                <p className="text-sm font-medium">Role: Field Owner</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/profile">
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Create New Field</CardTitle>
                <CardDescription>Add a new football field to your portfolio</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/admin/fields/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Field
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
