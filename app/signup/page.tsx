// app/signup/page.tsx
export const dynamic = "force-dynamic"; // prevents static generation
"use client";

import SignupPageContent from "@/components/signup/signup-page-content";

export default function SignupPage() {
  return <SignupPageContent />;
}
