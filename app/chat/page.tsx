'use client';

import { useState } from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { PlayerLayoutWrapper } from '@/components/player-layout-wrapper';

export default function ChatPage() {
  const [supabase] = useState(() => createPagesBrowserClient());

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <PlayerLayoutWrapper>
        <h1 className="text-2xl font-bold mb-6">Chat</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">
            No active conversations. Connect with friends to start chatting.
          </p>
        </div>
      </PlayerLayoutWrapper>
    </SessionContextProvider>
  );
}

export const dynamic = "force-dynamic";
