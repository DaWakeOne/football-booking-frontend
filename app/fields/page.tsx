'use client';

import { useUser } from '@supabase/auth-helpers-react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';

export default function FieldsPage() {
  const userContext = useUser(); // Safe access pattern
  const [supabase] = useState(() => createPagesBrowserClient());

  return (
    <div>
      <h1>Fields</h1>
      {userContext?.user ? (
        <p>Welcome, {userContext.user.email}</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
