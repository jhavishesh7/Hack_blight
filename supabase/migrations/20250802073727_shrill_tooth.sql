/*
  # Plant Care Application Database Schema

  1. New Tables
    - `profiles` - User profiles and preferences
    - `plants` - User's plant collection
    - `care_schedules` - Plant care scheduling and reminders
    - `care_logs` - Historical care activities
    - `videos` - Learning video content
    - `video_categories` - Video categorization
    - `products` - Marketplace products
    - `product_categories` - Product categorization
    - `orders` - User orders from marketplace
    - `order_items` - Individual items in orders
    - `experts` - Plant care experts
    - `chat_conversations` - Expert chat conversations
    - `chat_messages` - Individual chat messages
    - `bot_automations` - WhatsApp bot automation rules
    - `bot_conversations` - WhatsApp bot conversations
    - `bot_messages` - WhatsApp bot messages

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access where appropriate
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  phone text,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create plants table
CREATE TABLE IF NOT EXISTS plants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  species text,
  image_url text,
  health_score integer DEFAULT 100 CHECK (health_score >= 0 AND health_score <= 100),
  location text,
  acquired_date date DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create care_schedules table
CREATE TABLE IF NOT EXISTS care_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id uuid REFERENCES plants(id) ON DELETE CASCADE,
  care_type text NOT NULL CHECK (care_type IN ('water', 'fertilize', 'prune', 'repot', 'mist', 'rotate')),
  frequency_days integer NOT NULL DEFAULT 7,
  next_due_date date NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create care_logs table
CREATE TABLE IF NOT EXISTS care_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id uuid REFERENCES plants(id) ON DELETE CASCADE,
  care_type text NOT NULL,
  completed_at timestamptz DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create video_categories table
CREATE TABLE IF NOT EXISTS video_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  thumbnail_url text,
  video_url text,
  duration_seconds integer DEFAULT 0,
  instructor_name text,
  instructor_avatar text,
  rating decimal(3,2) DEFAULT 0.0,
  view_count integer DEFAULT 0,
  category_id uuid REFERENCES video_categories(id),
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product_categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  original_price decimal(10,2),
  image_url text,
  seller_name text,
  rating decimal(3,2) DEFAULT 0.0,
  review_count integer DEFAULT 0,
  stock_quantity integer DEFAULT 0,
  category_id uuid REFERENCES product_categories(id),
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  shipping_address jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create experts table
CREATE TABLE IF NOT EXISTS experts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  specialty text,
  bio text,
  avatar_url text,
  rating decimal(3,2) DEFAULT 0.0,
  review_count integer DEFAULT 0,
  hourly_rate decimal(10,2),
  response_time_minutes integer DEFAULT 30,
  is_online boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_conversations table
CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  expert_id uuid REFERENCES experts(id) ON DELETE CASCADE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  total_duration_minutes integer DEFAULT 0,
  total_cost decimal(10,2) DEFAULT 0.0
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES chat_conversations(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  file_url text,
  created_at timestamptz DEFAULT now()
);

-- Create bot_automations table
CREATE TABLE IF NOT EXISTS bot_automations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  trigger_type text NOT NULL CHECK (trigger_type IN ('message', 'keyword', 'schedule', 'image')),
  trigger_value text,
  response_message text NOT NULL,
  is_active boolean DEFAULT true,
  response_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bot_conversations table
CREATE TABLE IF NOT EXISTS bot_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text NOT NULL,
  user_name text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'blocked')),
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create bot_messages table
CREATE TABLE IF NOT EXISTS bot_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES bot_conversations(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_from_bot boolean DEFAULT false,
  automation_id uuid REFERENCES bot_automations(id),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Plants policies
CREATE POLICY "Users can manage own plants"
  ON plants FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Care schedules policies
CREATE POLICY "Users can manage care schedules for own plants"
  ON care_schedules FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM plants 
    WHERE plants.id = care_schedules.plant_id 
    AND plants.user_id = auth.uid()
  ));

-- Care logs policies
CREATE POLICY "Users can manage care logs for own plants"
  ON care_logs FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM plants 
    WHERE plants.id = care_logs.plant_id 
    AND plants.user_id = auth.uid()
  ));

-- Video categories policies (public read)
CREATE POLICY "Anyone can view video categories"
  ON video_categories FOR SELECT
  TO authenticated
  USING (true);

-- Videos policies (public read)
CREATE POLICY "Anyone can view videos"
  ON videos FOR SELECT
  TO authenticated
  USING (true);

-- Product categories policies (public read)
CREATE POLICY "Anyone can view product categories"
  ON product_categories FOR SELECT
  TO authenticated
  USING (true);

-- Products policies (public read)
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

-- Orders policies
CREATE POLICY "Users can manage own orders"
  ON orders FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view order items for own orders"
  ON order_items FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  ));

-- Experts policies (public read for browsing)
CREATE POLICY "Anyone can view experts"
  ON experts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Experts can update own profile"
  ON experts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Chat conversations policies
CREATE POLICY "Users can view own conversations"
  ON chat_conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM experts 
    WHERE experts.id = chat_conversations.expert_id 
    AND experts.user_id = auth.uid()
  ));

CREATE POLICY "Users can create conversations"
  ON chat_conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Users can view messages in own conversations"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM chat_conversations 
    WHERE chat_conversations.id = chat_messages.conversation_id 
    AND (chat_conversations.user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM experts 
      WHERE experts.id = chat_conversations.expert_id 
      AND experts.user_id = auth.uid()
    ))
  ));

CREATE POLICY "Users can send messages in own conversations"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Bot automations policies (admin only for now)
CREATE POLICY "Authenticated users can view bot automations"
  ON bot_automations FOR SELECT
  TO authenticated
  USING (true);

-- Bot conversations policies (admin only for now)
CREATE POLICY "Authenticated users can view bot conversations"
  ON bot_conversations FOR SELECT
  TO authenticated
  USING (true);

-- Bot messages policies (admin only for now)
CREATE POLICY "Authenticated users can view bot messages"
  ON bot_messages FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_plants_user_id ON plants(user_id);
CREATE INDEX IF NOT EXISTS idx_care_schedules_plant_id ON care_schedules(plant_id);
CREATE INDEX IF NOT EXISTS idx_care_schedules_next_due_date ON care_schedules(next_due_date);
CREATE INDEX IF NOT EXISTS idx_care_logs_plant_id ON care_logs(plant_id);
CREATE INDEX IF NOT EXISTS idx_videos_category_id ON videos(category_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_expert_id ON chat_conversations(expert_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);