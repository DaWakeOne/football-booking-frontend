"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { AuthCheck } from "@/components/auth-check"
import { PlayerAvailabilityView } from "@/components/player-availability-view"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PlayerAvailabilityPage() {
  const params = useParams()
  const playerId = params.id as string

  const [playerData, setPlayerData] = useState<{
    id: string
    name: string
    isFriend: boolean
    isTeammate: boolean
  } | null>(null)

  useEffect(() => {
    // In a real app, you would fetch the player data from your API
    // For demo purposes, we'll use mock data
    setPlayerData({
      id: playerId,
      name: "John Doe",
      isFriend: true,
      isTeammate: false,
    })
  }, [playerId])

  if (!playerData) {
    return (
      <div className="container py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-center mt-4">Loading player data...</p>
      </div>
    )
  }

  return (
    <AuthCheck requiredRole="player">
      <div className="container py-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/players">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Players
            </Link>
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-8">{playerData.name}'s Availability</h1>

        <PlayerAvailabilityView
          playerId={playerData.id}
          playerName={playerData.name}
          isFriend={playerData.isFriend}
          isTeammate={playerData.isTeammate}
        />
      </div>
    </AuthCheck>
  )
}
