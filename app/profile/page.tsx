"use client"

import { PlayerLayoutWrapper } from "@/components/player-layout-wrapper"

export default function ProfilePage() {
  return (
    <PlayerLayoutWrapper>
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
        <p className="text-gray-500">Update your profile information here.</p>
      </div>
    </PlayerLayoutWrapper>
  )
}
