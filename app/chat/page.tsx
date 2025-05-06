'use client';

import { PlayerLayoutWrapper } from '@/components/player-layout-wrapper';

export default function ChatPage() {
  return (
    <PlayerLayoutWrapper>
      <h1 className="text-2xl font-bold mb-6">Chat</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500">
          No active conversations. Connect with friends to start chatting.
        </p>
      </div>
    </PlayerLayoutWrapper>
  );
}
