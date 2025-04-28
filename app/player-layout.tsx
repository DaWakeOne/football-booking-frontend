"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider.tsx"
import { redirect } from "next/navigation"
import { useEffect } from "react"
import { PlayerLeftSidebar } from "@/components/player-left-sidebar"
import { PlayerRightSidebar } from "@/components/player-right-sidebar"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

interface PlayerLayoutProps {
  children: React.ReactNode
}

export default function PlayerLayout({ children }: PlayerLayoutProps) {
  const { user, userRole, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && (!user || userRole !== "player")) {
      redirect("/login/player")
    }
  }, [user, userRole, isLoading])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          <PlayerLeftSidebar />
          <SidebarInset>
            <main className="flex-1">{children}</main>
          </SidebarInset>
          <PlayerRightSidebar />
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  )
}
