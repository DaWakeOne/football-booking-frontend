"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider.tsx"
import PlayerLayout from "@/app/player-layout"

interface PlayerLayoutWrapperProps {
  children: React.ReactNode
}

export function PlayerLayoutWrapper({ children }: PlayerLayoutWrapperProps) {
  const { user, userRole, isLoading } = useAuth()

  // If the user is a player, wrap the content in the player layout
  if (!isLoading && user && userRole === "player") {
    return <PlayerLayout>{children}</PlayerLayout>
  }

  // Otherwise, just render the children
  return <>{children}</>
}
