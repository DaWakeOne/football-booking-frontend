"use client"

import "./globals.css"
import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { SessionContextProvider } from "@supabase/auth-helpers-react"

export default function ClientLayout({ children }) {
  const [supabase] = useState(() => createClientComponentClient())

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <main className="min-h-screen bg-white">{children}</main>
    </SessionContextProvider>
  )
}
