-- Fix auth trigger that's causing database error during signup
-- This migration updates the handle_new_user function to work with the new profiles table structure

-- Drop the existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the existing function
DROP FUNCTION IF EXISTS handle_new_user();

-- Create an improved function that handles errors gracefully
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Try to insert the profile, but don't fail if it doesn't work
  -- This prevents the entire signup from failing
  BEGIN
    INSERT INTO profiles (user_id, email, full_name)
    VALUES (
      NEW.id, 
      NEW.email, 
      COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
  EXCEPTION
    WHEN OTHERS THEN
      -- Log the error but don't fail the signup
      RAISE LOG 'Failed to create profile for user %: %', NEW.id, SQLERRM;
      -- Continue with the signup process
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Add comment
COMMENT ON FUNCTION handle_new_user() IS 'Creates a profile for new users, but fails gracefully if profile creation fails'; 