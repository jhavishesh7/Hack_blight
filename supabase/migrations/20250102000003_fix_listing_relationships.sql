-- Fix foreign key relationships for user_listings table

-- First, let's check if the foreign key constraint exists and drop it if it does
DO $$
BEGIN
    -- Check if the foreign key constraint exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_listings_user_id_fkey' 
        AND table_name = 'user_listings'
    ) THEN
        -- Drop the existing foreign key constraint
        ALTER TABLE user_listings DROP CONSTRAINT user_listings_user_id_fkey;
    END IF;
END $$;

-- Ensure profiles table has a unique constraint on user_id
DO $$
BEGIN
    -- Check if unique constraint exists on profiles.user_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'profiles_user_id_key' 
        AND table_name = 'profiles'
        AND constraint_type = 'UNIQUE'
    ) THEN
        -- Add unique constraint to profiles.user_id
        ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
    END IF;
END $$;

-- Now create a proper foreign key relationship to profiles table
ALTER TABLE user_listings 
ADD CONSTRAINT user_listings_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE;

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_user_listings_user_id_profiles ON user_listings(user_id);

-- Update the RLS policies to work with the new relationship
DO $$
BEGIN
    -- Drop existing policies if they exist
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_listings' AND policyname = 'Users can view all active listings') THEN
        DROP POLICY "Users can view all active listings" ON user_listings;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_listings' AND policyname = 'Users can create their own listings') THEN
        DROP POLICY "Users can create their own listings" ON user_listings;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_listings' AND policyname = 'Users can update their own listings') THEN
        DROP POLICY "Users can update their own listings" ON user_listings;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_listings' AND policyname = 'Users can delete their own listings') THEN
        DROP POLICY "Users can delete their own listings" ON user_listings;
    END IF;
END $$;

-- Recreate the policies with proper auth.uid() checks
CREATE POLICY "Users can view all active listings" ON user_listings
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create their own listings" ON user_listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings" ON user_listings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings" ON user_listings
  FOR DELETE USING (auth.uid() = user_id); 