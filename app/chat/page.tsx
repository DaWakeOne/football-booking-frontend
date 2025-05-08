"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/ui/auth-provider" // ✅ Use your own auth hook
import { AuthProvider } from "@/components/ui/auth-provider" // ✅ Provide the context

function ChatPageContent() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
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

export default function ChatPage() {
  return (
    <AuthProvider>
      <ChatPageContent />
    </AuthProvider>
  )
}
