'use client';

import './globals.css';
import { useState } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { AuthProvider } from '@/components/auth-provider'; // ✅ Add this line

export default function RootLayout({ children }) {
  const [supabase] = useState(() => createBrowserSupabaseClient());

  return (
    <html lang="en">
      <body>
        <SessionContextProvider supabaseClient={supabase}>
          <AuthProvider> {/* ✅ Wrap children with your custom AuthProvider */}
            {children}
          </AuthProvider>
        </SessionContextProvider>
      </body>
    </html>
  );
}
