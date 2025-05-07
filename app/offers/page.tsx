'use client'

import { PlayerLayoutWrapper } from "@components/player-layout-wrapper"

export default function OffersPage() {
  return (
    <PlayerLayoutWrapper>
      <h1 className="text-2xl font-bold mb-6">Special Offers</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500">
          No special offers available at the moment. Check back later!
        </p>
      </div>
    </PlayerLayoutWrapper>
  )
}
