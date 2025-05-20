"use client";
export const dynamic = "force-dynamic";

import SignupPageContent from "@/components/signup/signup-page-content";
import { AuthProvider } from "@/components/auth-provider"; // ✅ your custom provider

export default function SignupPage() {
  return (
    <AuthProvider>
      <SignupPageContent />
    </AuthProvider>
  );
}
