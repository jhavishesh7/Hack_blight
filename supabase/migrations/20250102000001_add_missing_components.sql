-- Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_plants_user_id ON plants(user_id);
CREATE INDEX IF NOT EXISTS idx_care_schedules_plant_id ON care_schedules(plant_id);
CREATE INDEX IF NOT EXISTS idx_care_schedules_next_due_date ON care_schedules(next_due_date);
CREATE INDEX IF NOT EXISTS idx_care_logs_plant_id ON care_logs(plant_id);
CREATE INDEX IF NOT EXISTS idx_videos_category_id ON videos(category_id);
CREATE INDEX IF NOT EXISTS idx_videos_is_featured ON videos(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_experts_is_online ON experts(is_online);
CREATE INDEX IF NOT EXISTS idx_experts_is_verified ON experts(is_verified);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_expert_id ON chat_conversations(expert_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_bot_messages_conversation_id ON bot_messages(conversation_id);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for plants
DROP POLICY IF EXISTS "Users can view own plants" ON plants;
DROP POLICY IF EXISTS "Users can insert own plants" ON plants;
DROP POLICY IF EXISTS "Users can update own plants" ON plants;
DROP POLICY IF EXISTS "Users can delete own plants" ON plants;

CREATE POLICY "Users can view own plants" ON plants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own plants" ON plants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own plants" ON plants FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own plants" ON plants FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for care schedules
DROP POLICY IF EXISTS "Users can view own care schedules" ON care_schedules;
DROP POLICY IF EXISTS "Users can insert own care schedules" ON care_schedules;
DROP POLICY IF EXISTS "Users can update own care schedules" ON care_schedules;
DROP POLICY IF EXISTS "Users can delete own care schedules" ON care_schedules;

CREATE POLICY "Users can view own care schedules" ON care_schedules FOR SELECT USING (
  EXISTS (SELECT 1 FROM plants WHERE plants.id = care_schedules.plant_id AND plants.user_id = auth.uid())
);
CREATE POLICY "Users can insert own care schedules" ON care_schedules FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM plants WHERE plants.id = care_schedules.plant_id AND plants.user_id = auth.uid())
);
CREATE POLICY "Users can update own care schedules" ON care_schedules FOR UPDATE USING (
  EXISTS (SELECT 1 FROM plants WHERE plants.id = care_schedules.plant_id AND plants.user_id = auth.uid())
);
CREATE POLICY "Users can delete own care schedules" ON care_schedules FOR DELETE USING (
  EXISTS (SELECT 1 FROM plants WHERE plants.id = care_schedules.plant_id AND plants.user_id = auth.uid())
);

-- Create RLS policies for care logs
DROP POLICY IF EXISTS "Users can view own care logs" ON care_logs;
DROP POLICY IF EXISTS "Users can insert own care logs" ON care_logs;

CREATE POLICY "Users can view own care logs" ON care_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM plants WHERE plants.id = care_logs.plant_id AND plants.user_id = auth.uid())
);
CREATE POLICY "Users can insert own care logs" ON care_logs FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM plants WHERE plants.id = care_logs.plant_id AND plants.user_id = auth.uid())
);

-- Create RLS policies for chat conversations
DROP POLICY IF EXISTS "Users can view own conversations" ON chat_conversations;
DROP POLICY IF EXISTS "Users can insert own conversations" ON chat_conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON chat_conversations;

CREATE POLICY "Users can view own conversations" ON chat_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversations" ON chat_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON chat_conversations FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for chat messages
DROP POLICY IF EXISTS "Users can view messages in own conversations" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert messages in own conversations" ON chat_messages;

CREATE POLICY "Users can view messages in own conversations" ON chat_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM chat_conversations WHERE chat_conversations.id = chat_messages.conversation_id AND chat_conversations.user_id = auth.uid())
);
CREATE POLICY "Users can insert messages in own conversations" ON chat_messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM chat_conversations WHERE chat_conversations.id = chat_messages.conversation_id AND chat_conversations.user_id = auth.uid())
);

-- Create RLS policies for experts (experts can view their own profile, users can view all experts)
DROP POLICY IF EXISTS "Experts can manage own profile" ON experts;
DROP POLICY IF EXISTS "Users can view all experts" ON experts;

CREATE POLICY "Experts can manage own profile" ON experts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view all experts" ON experts FOR SELECT USING (true);

-- Create RLS policies for orders
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;

CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON orders FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for order items
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Users can insert own order items" ON order_items;

CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can insert own order items" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert sample data for video categories (if not exists)
INSERT INTO video_categories (name, description) VALUES
('Plant Care Basics', 'Fundamental plant care techniques'),
('Advanced Gardening', 'Advanced gardening methods and tips'),
('Plant Identification', 'Learn to identify different plant species'),
('Troubleshooting', 'Common plant problems and solutions')
ON CONFLICT (name) DO NOTHING;

-- Insert sample data for product categories (if not exists)
INSERT INTO product_categories (name, description) VALUES
('Seeds', 'High-quality plant seeds'),
('Tools', 'Essential gardening tools'),
('Fertilizers', 'Plant nutrition and fertilizers'),
('Pots & Containers', 'Plant containers and pots')
ON CONFLICT (name) DO NOTHING;

-- Insert sample bot automations (if not exists)
INSERT INTO bot_automations (name, description, trigger_type, trigger_value, response_message, is_active) VALUES
('Welcome Message', 'Sends welcome message to new users', 'message', 'hello', 'Welcome to PlantCare Pro! 🌿 How can I help you with your plants today?', true),
('Watering Reminder', 'Reminds users about watering', 'keyword', 'water', 'Remember to check your plants soil moisture! Most plants need water when the top inch of soil feels dry.', true),
('Plant Health', 'Provides plant health tips', 'keyword', 'health', 'To keep your plants healthy: 1) Ensure proper lighting 2) Water appropriately 3) Check for pests regularly 4) Use quality soil', true)
ON CONFLICT DO NOTHING;

-- Add some sample products
INSERT INTO products (name, description, price, original_price, image_url, seller_name, rating, review_count, stock_quantity, category_id, is_featured) 
SELECT 
  'Organic Plant Food',
  'All-natural fertilizer for healthy plant growth',
  15.99,
  19.99,
  'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400',
  'Green Thumb Co.',
  4.5,
  127,
  50,
  pc.id,
  true
FROM product_categories pc WHERE pc.name = 'Fertilizers'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, image_url, seller_name, rating, review_count, stock_quantity, category_id, is_featured) 
SELECT 
  'Premium Watering Can',
  'Elegant metal watering can with fine rose',
  29.99,
  'https://images.unsplash.com/photo-1593691509543-c55fb32e5ceb?w=400',
  'Garden Essentials',
  4.8,
  89,
  25,
  pc.id,
  true
FROM product_categories pc WHERE pc.name = 'Tools'
ON CONFLICT DO NOTHING;

-- Add some sample videos
INSERT INTO videos (title, description, thumbnail_url, video_url, duration_seconds, instructor_name, instructor_avatar, rating, view_count, category_id, is_featured) 
SELECT 
  'Plant Care 101: Getting Started',
  'Learn the basics of plant care and maintenance',
  'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400',
  'https://example.com/videos/plant-care-101.mp4',
  600,
  'Dr. Sarah Green',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
  4.7,
  1250,
  vc.id,
  true
FROM video_categories vc WHERE vc.name = 'Plant Care Basics'
ON CONFLICT DO NOTHING; 