'use client'

import dynamic from 'next/dynamic'
import { ClientOnly } from '@/components/client-only'
import { AuthProvider } from '@/components/auth-provider'
import { PlayerLayoutWrapper } from '@/components/player-layout-wrapper'

// ⬇️ Dynamically import with SSR disabled
const SchedulePageContent = dynamic(() => import('@/components/schedule-page-content'), {
  ssr: false,
})

export default function SchedulePage() {
  return (
    <ClientOnly>
      <AuthProvider>
        <PlayerLayoutWrapper>
          <h1 className="text-2xl font-bold mb-6">My Schedule</h1>
          <SchedulePageContent />
        </PlayerLayoutWrapper>
      </AuthProvider>
    </ClientOnly>
  )
}
