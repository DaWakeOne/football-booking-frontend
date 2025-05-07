'use client'

import { ClientOnly } from '@/components/client-only'
import { AuthProvider } from '@/components/auth-provider'

export default function ProfilePage() {
  return (
    <ClientOnly>
      <AuthProvider>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
          <p className="text-gray-600">Welcome to your profile page. More details coming soon.</p>
        </div>
      </AuthProvider>
    </ClientOnly>
  )
}
