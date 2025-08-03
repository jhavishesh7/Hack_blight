-- Alternative solution: Disable the auth trigger and handle profile creation manually
-- This prevents the database error during signup

-- Disable the trigger temporarily
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Comment out the function (don't drop it in case we want to re-enable later)
-- DROP FUNCTION IF EXISTS handle_new_user();

-- Add a comment explaining the change
COMMENT ON TABLE profiles IS 'Profiles are now created manually in the frontend after successful signup'; 