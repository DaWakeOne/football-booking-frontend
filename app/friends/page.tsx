"use client"

import { PlayerLayoutWrapper } from "@/components/player-layout-wrapper"

export default function FriendsPage() {
  return (
    <PlayerLayoutWrapper>
      <h1 className="text-2xl font-bold mb-6">Friends</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">My Friends</h2>
          <p className="text-gray-500">You don't have any friends yet.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Friend Requests</h2>
          <p className="text-gray-500">No pending friend requests.</p>
        </div>
      </div>
    </PlayerLayoutWrapper>
  )
}
