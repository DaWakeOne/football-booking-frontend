'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-context';

export default function FieldsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div>
      <h1>Fields</h1>
      {user ? <p>Welcome, {user.email}</p> : <p>Please log in</p>}
    </div>
  );
}
