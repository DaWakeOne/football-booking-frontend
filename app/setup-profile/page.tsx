"use client"

import { Suspense } from "react"
import { SetupProfileWrapper } from "@/components/setup-profile-wrapper"

export default function SetupProfilePage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <SetupProfileWrapper />
    </Suspense>
  )
}
