-- Add sell functionality tables for marketplace

-- Create user_listings table for plants that users want to sell
CREATE TABLE IF NOT EXISTS user_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  currency TEXT DEFAULT 'USD',
  condition TEXT CHECK (condition IN ('excellent', 'good', 'fair', 'poor')) DEFAULT 'good',
  images TEXT[], -- Array of image URLs
  location TEXT,
  shipping_available BOOLEAN DEFAULT false,
  local_pickup BOOLEAN DEFAULT true,
  status TEXT CHECK (status IN ('active', 'sold', 'inactive', 'pending')) DEFAULT 'active',
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create listing_messages table for communication between buyers and sellers
CREATE TABLE IF NOT EXISTS listing_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES user_listings(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create listing_favorites table for users to save listings
CREATE TABLE IF NOT EXISTS listing_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES user_listings(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

-- Create listing_views table to track views
CREATE TABLE IF NOT EXISTS listing_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES user_listings(id) ON DELETE CASCADE NOT NULL,
  viewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  viewed_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_views ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_listings_user_id ON user_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_listings_status ON user_listings(status);
CREATE INDEX IF NOT EXISTS idx_user_listings_created_at ON user_listings(created_at);
CREATE INDEX IF NOT EXISTS idx_listing_messages_listing_id ON listing_messages(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_favorites_user_id ON listing_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_listing_views_listing_id ON listing_views(listing_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for user_listings
DROP TRIGGER IF EXISTS update_user_listings_updated_at ON user_listings;
CREATE TRIGGER update_user_listings_updated_at 
    BEFORE UPDATE ON user_listings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Policies for user_listings
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

CREATE POLICY "Users can view all active listings" ON user_listings
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create their own listings" ON user_listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings" ON user_listings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings" ON user_listings
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for listing_messages
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'listing_messages' AND policyname = 'Users can view messages they sent or received') THEN
        DROP POLICY "Users can view messages they sent or received" ON listing_messages;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'listing_messages' AND policyname = 'Users can send messages') THEN
        DROP POLICY "Users can send messages" ON listing_messages;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'listing_messages' AND policyname = 'Users can update their own messages') THEN
        DROP POLICY "Users can update their own messages" ON listing_messages;
    END IF;
END $$;

CREATE POLICY "Users can view messages they sent or received" ON listing_messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON listing_messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages" ON listing_messages
  FOR UPDATE USING (auth.uid() = sender_id);

-- Policies for listing_favorites
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'listing_favorites' AND policyname = 'Users can view their own favorites') THEN
        DROP POLICY "Users can view their own favorites" ON listing_favorites;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'listing_favorites' AND policyname = 'Users can create their own favorites') THEN
        DROP POLICY "Users can create their own favorites" ON listing_favorites;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'listing_favorites' AND policyname = 'Users can delete their own favorites') THEN
        DROP POLICY "Users can delete their own favorites" ON listing_favorites;
    END IF;
END $$;

CREATE POLICY "Users can view their own favorites" ON listing_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites" ON listing_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON listing_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for listing_views
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'listing_views' AND policyname = 'Anyone can view listing views') THEN
        DROP POLICY "Anyone can view listing views" ON listing_views;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'listing_views' AND policyname = 'Anyone can create listing views') THEN
        DROP POLICY "Anyone can create listing views" ON listing_views;
    END IF;
END $$;

CREATE POLICY "Anyone can view listing views" ON listing_views
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create listing views" ON listing_views
  FOR INSERT WITH CHECK (true); 