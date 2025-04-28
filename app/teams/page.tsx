"use client"

import { useState } from "react"
import { AuthCheck } from "@/components/auth-check"
import { PlayerLayoutWrapper } from "@/components/player-layout-wrapper"

export default function TeamsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newTeamName, setNewTeamName] = useState("")
  const [newTeamDescription, setNewTeamDescription] = useState("")

  // Mock data for teams
  const myTeams = [
    {
      id: "1",
      name: "City Strikers",
      role: "Captain",
      members: 12,
      nextGame: "Tomorrow, 3 PM",
      location: "Central Stadium",
    },
    {
      id: "2",
      name: "Weekend Warriors",
      role: "Member",
      members: 8,
      nextGame: "Saturday, 5 PM",
      location: "Community Field",
    },
  ]

  const teamInvites = [
    {
      id: "3",
      name: "Local United",
      invitedBy: "Mike Johnson",
      members: 15,
    },
  ]

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return

    // In a real app, you would send the team data to the server
    console.log("Creating team:", { name: newTeamName, description: newTeamDescription })

    // Close the dialog and reset form
    setCreateDialogOpen(false)
    setNewTeamName("")
    setNewTeamDescription("")
  }

  return (
    <AuthCheck requiredRole="player">
      <PlayerLayoutWrapper>
        <h1 className="text-2xl font-bold mb-6">Teams</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">My Teams</h2>
            <p className="text-gray-500">You're not part of any teams yet.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Team Invitations</h2>
            <p className="text-gray-500">No pending team invitations.</p>
          </div>
        </div>
      </PlayerLayoutWrapper>
    </AuthCheck>
  )
}
