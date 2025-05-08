"use client"

import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { useState } from "react"
import { type SupabaseClient, type Session } from "@supabase/auth-helpers-nextjs"
import { type Database } from "@/types/supabase" // adjust to your project path

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [supabaseClient] = useState(() =>
    createPagesBrowserClient<Database>()
  )

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  )
}
