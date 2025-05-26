'use client';

import { useAuth } from '@/components/auth-context';

export default function FieldsPage() {
  const { user } = useAuth();

  // Avoid any server-side rendering attempt
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div>
      <h1>Fields</h1>
      {user ? <p>Welcome, {user.email}</p> : <p>Please log in</p>}
    </div>
  );
}
