'use client';

import { useState } from 'react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { AuthProvider } from '@/components/auth-provider';
import type { Database } from '@/types/supabase';

export const dynamic = 'force-dynamic';

export default function FieldsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabaseClient] = useState(() =>
    createPagesBrowserClient<Database>()
  );

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <AuthProvider>{children}</AuthProvider>
    </SessionContextProvider>
  );
}
