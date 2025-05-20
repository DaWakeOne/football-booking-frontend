"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { AuthCheck } from "@/components/auth-check";
import { PlayerLayoutWrapper } from "@/components/player-layout-wrapper";

export default function TeamsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");

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
  ];

  const teamInvites = [
    {
      id: "3",
      name: "Local United",
      invitedBy: "Mike Johnson",
      members: 15,
    },
  ];

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return;

    console.log("Creating team:", {
      name: newTeamName,
      description: newTeamDescription,
    });

    setCreateDialogOpen(false);
    setNewTeamName("");
    setNewTeamDescription("");
  };

  return (
    <AuthCheck requiredRole="player">
      <PlayerLayoutWrapper>
        <h1 className="text-2xl font-bold mb-6">Teams</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">My Teams</h2>
            {myTeams.length === 0 ? (
              <p className="text-gray-500">You're not part of any teams yet.</p>
            ) : (
              <ul className="space-y-2">
                {myTeams.map((team) => (
                  <li key={team.id} className="border p-4 rounded">
                    <h3 className="font-semibold">{team.name}</h3>
                    <p className="text-sm text-gray-600">
                      Role: {team.role} | Members: {team.members}
                    </p>
                    <p className="text-sm text-gray-600">
                      Next Game: {team.nextGame} @ {team.location}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Team Invitations</h2>
            {teamInvites.length === 0 ? (
              <p className="text-gray-500">No pending team invitations.</p>
            ) : (
              <ul className="space-y-2">
                {teamInvites.map((invite) => (
                  <li key={invite.id} className="border p-4 rounded">
                    <h3 className="font-semibold">{invite.name}</h3>
                    <p className="text-sm text-gray-600">
                      Invited by: {invite.invitedBy} | Members: {invite.members}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </PlayerLayoutWrapper>
    </AuthCheck>
  );
}
