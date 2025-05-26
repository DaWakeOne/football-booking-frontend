"use client";

import { AuthProvider } from "@/components/auth-provider";

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
