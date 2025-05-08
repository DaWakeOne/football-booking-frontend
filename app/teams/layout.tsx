"use client"

import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { useState } from "react"
import { type Database } from "@/types/supabase" // Adjust path if needed

export default function TeamsLayout({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient<Database>())

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  )
}
