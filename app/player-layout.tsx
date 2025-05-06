import type React from "react"
import { PlayerLayoutWrapper } from "@/components/player-layout-wrapper"
 
export default function PlayerLayout({ children }: { children: React.ReactNode }) {
  return <PlayerLayoutWrapper>{children}</PlayerLayoutWrapper>
}
