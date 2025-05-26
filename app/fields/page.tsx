'use client';

import { useAuth } from '@/components/auth-context';

export default function FieldsPage() {
  const { user } = useAuth();

  // Prevent rendering until user is available on the client
  if (typeof window !== 'undefined' && !user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Fields</h1>
      {user ? <p>Welcome, {user.email}</p> : <p>Please log in</p>}
    </div>
  );
}
