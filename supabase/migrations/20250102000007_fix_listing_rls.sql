-- Fix RLS policies for user_listings to allow system updates during purchases

-- Drop existing update policy
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_listings' AND policyname = 'Users can update their own listings') THEN
        DROP POLICY "Users can update their own listings" ON user_listings;
    END IF;
END $$;

-- Create new update policy that allows system updates
CREATE POLICY "Users can update their own listings" ON user_listings
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    -- Allow system to update listing status during purchase
    (auth.uid() IS NOT NULL AND EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email IS NOT NULL
    ))
  );

-- Also add a policy for system operations
CREATE POLICY "System can update listings" ON user_listings
  FOR UPDATE USING (true)
  WITH CHECK (true); 