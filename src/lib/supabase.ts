import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Profile {
  id: string;
  user_id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  preferences?: any;
  created_at: string;
  updated_at: string;
}

export interface Plant {
  id: string;
  user_id: string;
  name: string;
  species?: string;
  image_url?: string;
  health_score: number;
  location?: string;
  acquired_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CareSchedule {
  id: string;
  plant_id: string;
  care_type: 'water' | 'fertilize' | 'prune' | 'repot' | 'mist' | 'rotate';
  frequency_days: number;
  next_due_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  plants?: Plant;
}

export interface CareLog {
  id: string;
  plant_id: string;
  care_type: string;
  completed_at: string;
  notes?: string;
  created_at: string;
  plants?: Plant;
}

export interface VideoCategory {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  video_url?: string;
  duration_seconds: number;
  instructor_name?: string;
  instructor_avatar?: string;
  rating: number;
  view_count: number;
  category_id?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  video_categories?: VideoCategory;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  image_url?: string;
  seller_name?: string;
  rating: number;
  review_count: number;
  stock_quantity: number;
  category_id?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  product_categories?: ProductCategory;
}

export interface Expert {
  id: string;
  user_id: string;
  name: string;
  specialty?: string;
  bio?: string;
  avatar_url?: string;
  rating: number;
  review_count: number;
  hourly_rate?: number;
  response_time_minutes: number;
  is_online: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatConversation {
  id: string;
  user_id: string;
  expert_id: string;
  status: 'active' | 'completed' | 'cancelled';
  started_at: string;
  ended_at?: string;
  total_duration_minutes: number;
  total_cost: number;
  experts?: Expert;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  message_type: 'text' | 'image' | 'file';
  file_url?: string;
  created_at: string;
}

export interface UserListing {
  id: string;
  user_id: string;
  plant_id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  images?: string[];
  location?: string;
  shipping_available: boolean;
  local_pickup: boolean;
  status: 'active' | 'sold' | 'inactive' | 'pending';
  views_count: number;
  created_at: string;
  updated_at: string;
  plants?: Plant;
  profiles?: Profile;
}

export interface ListingMessage {
  id: string;
  listing_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ListingFavorite {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
}

export interface ListingView {
  id: string;
  listing_id: string;
  viewer_id?: string;
  ip_address?: string;
  user_agent?: string;
  viewed_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'sale' | 'purchase' | 'system' | 'message';
  is_read: boolean;
  related_listing_id?: string;
  related_user_id?: string;
  created_at: string;
}

export interface BotAutomation {
  id: string;
  name: string;
  description?: string;
  trigger_type: 'message' | 'keyword' | 'schedule' | 'image';
  trigger_value?: string;
  response_message: string;
  is_active: boolean;
  response_count: number;
  created_at: string;
  updated_at: string;
}

export interface BotConversation {
  id: string;
  phone_number: string;
  user_name?: string;
  status: 'active' | 'completed' | 'blocked';
  last_message_at: string;
  created_at: string;
}

export interface BotMessage {
  id: string;
  conversation_id: string;
  message: string;
  is_from_bot: boolean;
  automation_id?: string;
  created_at: string;
}