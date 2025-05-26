'use client';

import './globals.css';
import { useState } from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { AuthProvider } from '@/components/auth-provider';

export default function RootLayout({ children }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <html lang="en">
      <body>
        <SessionContextProvider supabaseClient={supabaseClient}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </SessionContextProvider>
      </body>
    </html>
  );
}
