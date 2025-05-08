"use client"

import { useAuth } from "@supabase/auth-helpers-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ChatPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      // Redirect to login if no user is authenticated
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return <p>Redirecting to login...</p>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome to the Chat</h1>
      <p className="text-gray-600">This is a protected chat page for authenticated users only.</p>
    </div>
  )
}
