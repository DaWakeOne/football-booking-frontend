"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { SessionContextProvider } from "@supabase/auth-helpers-react"

export default function SupabaseProvider({ children }) {
  const [supabase] = useState(() => createClientComponentClient())

  return <SessionContextProvider supabaseClient={supabase}>{children}</SessionContextProvider>
}
