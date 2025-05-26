'use client';

import { useAuth } from '@/components/auth-context';

export default function FieldsPage() {
  const { user } = useAuth();

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Fields</h1>
      <p>Welcome, {user.email}</p>
    </div>
  );
}
