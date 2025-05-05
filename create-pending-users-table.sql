CREATE TABLE IF NOT EXISTS pending_users (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  attempts INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_pending_users_user_id ON pending_users(user_id);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_pending_users_status ON pending_users(status);
