"use client";

import { useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { AuthProvider } from "@/components/auth-provider";
import type { Database } from "@/types/supabase";

export const dynamic = "force-dynamic";

export default function FieldsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() =>
    createPagesBrowserClient<Database>()
  );

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <AuthProvider>{children}</AuthProvider>
    </SessionContextProvider>
  );
}
