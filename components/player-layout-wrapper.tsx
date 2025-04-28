"use client"

import type React from "react"

import { useAuth } from "@/components/auth-context"
import { Navbar } from "@/components/navbar"
import { MobileNav } from "@/components/mobile-nav"
import { PlayerLeftSidebar } from "@/components/player-left-sidebar"
import { PlayerRightSidebar } from "@/components/player-right-sidebar"
import { Footer } from "@/components/footer"
import { Loader2 } from "lucide-react"

export function PlayerLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading, user, userRole } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user || userRole !== "player") {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="text-xl font-bold">ActiModo</div>
          <MobileNav />
        </div>
        <div className="flex-1 p-4">
          <div className="bg-red-50 border border-red-200 p-4 rounded-md">
            <h2 className="text-lg font-semibold text-red-700">Authentication Required</h2>
            <p className="text-red-600">You need to be logged in as a player to view this page.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-40 bg-white">
        <Navbar />
      </div>
      <div className="flex flex-1">
        <PlayerLeftSidebar />
        <main className="flex-1 p-4">{children}</main>
        <PlayerRightSidebar />
      </div>
      <Footer />
    </div>
  )
}
