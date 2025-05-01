"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { AdminFieldsList } from "@/components/admin-fields-list"
import { useAuth } from "@/components/auth-provider"
import { getUserRole } from "@/lib/auth-utils"

export default function AdminFieldsPage() {
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Fields</h1>
        <Button asChild>
          <Link href="/admin/fields/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Field
          </Link>
        </Button>
      </div>

      <AdminFieldsList />
    </div>
  )
}
