'use client';

import { useUser } from '@supabase/auth-helpers-react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';

export default function FriendsPage() {
  const userContext = useUser();
  const [supabase] = useState(() => createPagesBrowserClient());

  return (
    <div>
      <h1>Friends</h1>
      {userContext?.user ? (
        <p>Welcome, {userContext.user.email}</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
