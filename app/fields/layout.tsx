"use client";
export const dynamic = "force-dynamic";

import { AuthProvider } from "@/components/auth-provider";

export default function FieldsLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
