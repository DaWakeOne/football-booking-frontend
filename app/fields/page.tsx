'use client';

import { useAuth } from '@/components/auth-context';

// ✅ This forces the page to be rendered only on the client
export const dynamic = 'force-dynamic';

export default function FieldsPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Fields</h1>
      {user ? <p>Welcome, {user.email}</p> : <p>Please log in</p>}
    </div>
  );
}
