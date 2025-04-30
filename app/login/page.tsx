"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Login to ActiMido</h1>
          <p className="text-sm text-muted-foreground">Choose your account type below</p>
        </div>
        <div className="grid gap-4">
          <Button asChild>
            <Link href="/login/player">Login as Player</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login/owner">Login as Field Owner</Link>
          </Button>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
