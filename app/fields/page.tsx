'use client';

import { useAuth } from '@supabase/auth-helpers-react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';

export default function FieldsPage() {
  const auth = useAuth(); // this must be inside the component
  const [supabase] = useState(() => createPagesBrowserClient());

  return (
    <div>
      <h1>Fields</h1>
      {/* You can use auth.user here */}
    </div>
  );
}
