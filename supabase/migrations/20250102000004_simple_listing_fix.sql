-- Simple fix for user_listings without changing foreign key relationships
-- This approach works with the existing auth.users reference

-- Ensure we have proper indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_listings_user_id ON user_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_listings_status ON user_listings(status);
CREATE INDEX IF NOT EXISTS idx_user_listings_created_at ON user_listings(created_at);

-- Ensure profiles table has proper indexing
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- Add a comment to clarify the relationship
COMMENT ON TABLE user_listings IS 'User listings reference auth.users directly, not profiles table'; 