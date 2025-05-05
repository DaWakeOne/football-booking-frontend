-- Create a function to safely insert a user profile
CREATE OR REPLACE FUNCTION create_user_profile(
  user_id UUID,
  user_email TEXT,
  user_role TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  success BOOLEAN;
BEGIN
  -- Check if the user already exists
  IF EXISTS (SELECT 1 FROM users WHERE id = user_id) THEN
    RETURN TRUE;
  END IF;
  
  -- Insert the user
  BEGIN
    INSERT INTO users (id, email, role)
    VALUES (user_id, user_email, user_role);
    success := TRUE;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating user: %', SQLERRM;
    success := FALSE;
  END;
  
  RETURN success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
