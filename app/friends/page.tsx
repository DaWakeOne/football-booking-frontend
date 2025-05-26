"use client";

import { useAuth } from "@/components/auth-context";

export default function FriendsPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Friends</h1>
      {user ? <p>Welcome, {user.email}</p> : <p>Please log in</p>}
    </div>
  );
}
