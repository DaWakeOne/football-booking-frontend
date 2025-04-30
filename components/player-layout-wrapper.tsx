"use client"

import type { ReactNode } from "react"
import { AuthCheck } from "@/components/auth-check"
import { PlayerLeftSidebar } from "@/components/player-left-sidebar"
import { PlayerRightSidebar } from "@/components/player-right-sidebar"

interface PlayerLayoutWrapperProps {
  children: ReactNode
}

export function PlayerLayoutWrapper({ children }: PlayerLayoutWrapperProps) {
  return (
    <AuthCheck requiredRole="player">
      <div className="flex min-h-screen">
        <PlayerLeftSidebar />
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
        <PlayerRightSidebar />
      </div>
    </AuthCheck>
  )
}
