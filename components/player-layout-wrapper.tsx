"use client"

import type { ReactNode } from "react"
import { PlayerLeftSidebar } from "@/components/player-left-sidebar"
import { PlayerRightSidebar } from "@/components/player-right-sidebar"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { AuthRequired } from "@/components/auth-required"

interface PlayerLayoutWrapperProps {
  children: ReactNode
}

export function PlayerLayoutWrapper({ children }: PlayerLayoutWrapperProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <MobileNav />

      <AuthRequired requiredRole="player" />

      <div className="flex-1 container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="hidden lg:block lg:col-span-2">
            <PlayerLeftSidebar />
          </div>

          <main className="lg:col-span-8">{children}</main>

          <div className="hidden lg:block lg:col-span-2">
            <PlayerRightSidebar />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
