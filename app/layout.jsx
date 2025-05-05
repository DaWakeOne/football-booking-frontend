'use client'

import './globals.css'
import { useState } from 'react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'

export default function RootLayout({ children }) {
  const [supabase] = useState(() => createBrowserSupabaseClient())

  return (
    <html lang="en">
      <body>
        <SessionContextProvider supabaseClient={supabase}>
          <main className="min-h-screen bg-white">{children}</main>
        </SessionContextProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
