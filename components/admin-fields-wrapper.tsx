"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { AdminFieldsList } from "@/components/admin-fields-list"

export function AdminFieldsWrapper() {
  const { user, userRole, isLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && (!user || userRole !== "owner")) {
      router.push("/login/owner")
    }
  }, [user, userRole, isLoading, router, mounted])

  if (!mounted || isLoading) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || userRole !== "owner") {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">My Football Fields</h1>
      <AdminFieldsList ownerId={user.id} />
    </div>
  )
}
