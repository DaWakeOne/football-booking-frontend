'use client';

import { useAuth } from '@/components/auth-context';
import dynamic from 'next/dynamic';

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
