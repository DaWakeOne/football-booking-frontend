'use client';

import './globals.css';
import { useState } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { AuthProvider } from '@/components/auth-provider'; // ✅ ADD THIS

export default function RootLayout({ children }) {
  const [supabase] = useState(() => createBrowserSupabaseClient());

  return (
    <html lang="en">
      <body>
        <AuthProvider> {/* ✅ WRAPPING ENTIRE APP */}
          <SessionContextProvider supabaseClient={supabase}>
            {children}
          </SessionContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
