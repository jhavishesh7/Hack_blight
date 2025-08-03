import { supabase, Plant, CareSchedule, CareLog, Profile, UserListing, ListingMessage, ListingFavorite, ListingView, Notification } from './supabase';

// Plant CRUD Operations
export const plantService = {
  // Get all plants for a user
  async getPlants(userId: string): Promise<Plant[]> {
    try {
      console.log('🔍 Fetching plants for user:', userId);
      
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Supabase error fetching plants:', error);
        throw error;
      }
      
      console.log('✅ Plants fetched:', data);
      return data || [];
    } catch (error) {
      console.error('❌ Error fetching plants:', error);
      throw error;
    }
  },

  // Get a single plant
  async getPlant(plantId: string): Promise<Plant | null> {
    try {
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .eq('id', plantId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching plant:', error);
      throw error;
    }
  },

  // Create a new plant
  async createPlant(plant: Omit<Plant, 'id' | 'created_at' | 'updated_at'>): Promise<Plant> {
    try {
      console.log('➕ Creating plant:', plant);
      
      const { data, error } = await supabase
        .from('plants')
        .insert([plant])
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error creating plant:', error);
        throw error;
      }
      
      console.log('✅ Plant created successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error creating plant:', error);
      throw error;
    }
  },

  // Update a plant
  async updatePlant(plantId: string, updates: Partial<Plant>): Promise<Plant> {
    try {
      const { data, error } = await supabase
        .from('plants')
        .update(updates)
        .eq('id', plantId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating plant:', error);
      throw error;
    }
  },

  // Delete a plant
  async deletePlant(plantId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('plants')
        .delete()
        .eq('id', plantId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting plant:', error);
      throw error;
    }
  }
};

// Care Schedule CRUD Operations
export const careScheduleService = {
  // Get care schedules for a user
  async getCareSchedules(userId: string): Promise<CareSchedule[]> {
    try {
      console.log('🔍 Fetching care schedules for user:', userId);
      
      // First get all plants for the user
      const { data: plants, error: plantsError } = await supabase
        .from('plants')
        .select('id')
        .eq('user_id', userId);

      if (plantsError) throw plantsError;
      
      if (!plants || plants.length === 0) {
        console.log('📝 No plants found for user, returning empty schedules');
        return [];
      }

      const plantIds = plants.map(p => p.id);
      console.log('🌱 Plant IDs:', plantIds);

      // Then get care schedules for those plants
      const { data, error } = await supabase
        .from('care_schedules')
        .select('*')
        .in('plant_id', plantIds)
        .order('next_due_date', { ascending: true });

      if (error) throw error;
      
      console.log('📅 Care schedules fetched:', data);
      return data || [];
    } catch (error) {
      console.error('❌ Error fetching care schedules:', error);
      throw error;
    }
  },

  // Get care schedules due today
  async getDueToday(userId: string): Promise<CareSchedule[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      console.log('🔍 Fetching due schedules for user:', userId, 'today:', today);
      
      // First get all plants for the user
      const { data: plants, error: plantsError } = await supabase
        .from('plants')
        .select('id')
        .eq('user_id', userId);

      if (plantsError) throw plantsError;
      
      if (!plants || plants.length === 0) {
        console.log('📝 No plants found for user, returning empty due schedules');
        return [];
      }

      const plantIds = plants.map(p => p.id);

      // Then get care schedules due today for those plants
      const { data, error } = await supabase
        .from('care_schedules')
        .select('*')
        .in('plant_id', plantIds)
        .eq('is_active', true)
        .lte('next_due_date', today)
        .order('next_due_date', { ascending: true });

      if (error) throw error;
      
      console.log('📅 Due schedules fetched:', data);
      return data || [];
    } catch (error) {
      console.error('❌ Error fetching due schedules:', error);
      throw error;
    }
  },

  // Create a care schedule
  async createCareSchedule(schedule: Omit<CareSchedule, 'id' | 'created_at' | 'updated_at'>): Promise<CareSchedule> {
    try {
      console.log('➕ Creating care schedule:', schedule);
      
      const { data, error } = await supabase
        .from('care_schedules')
        .insert([schedule])
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error creating care schedule:', error);
        throw error;
      }
      
      console.log('✅ Care schedule created successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error creating care schedule:', error);
      throw error;
    }
  },

  // Update a care schedule
  async updateCareSchedule(scheduleId: string, updates: Partial<CareSchedule>): Promise<CareSchedule> {
    try {
      const { data, error } = await supabase
        .from('care_schedules')
        .update(updates)
        .eq('id', scheduleId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating care schedule:', error);
      throw error;
    }
  },

  // Mark care schedule as completed
  async completeCareSchedule(scheduleId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('care_schedules')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', scheduleId);

      if (error) throw error;
    } catch (error) {
      console.error('Error completing care schedule:', error);
      throw error;
    }
  },

  // Delete a care schedule
  async deleteCareSchedule(scheduleId: string): Promise<void> {
    try {
      console.log('🗑️ Deleting care schedule:', scheduleId);
      const { error } = await supabase
        .from('care_schedules')
        .delete()
        .eq('id', scheduleId);

      if (error) {
        console.error('❌ Supabase error deleting care schedule:', error);
        throw error;
      }
      
      console.log('✅ Care schedule deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting care schedule:', error);
      throw error;
    }
  }
};

// Care Log CRUD Operations
export const careLogService = {
  // Get care logs for a user
  async getCareLogs(userId: string, limit?: number): Promise<CareLog[]> {
    try {
      console.log('🔍 Fetching care logs for user:', userId);
      
      // First get all plants for the user
      const { data: plants, error: plantsError } = await supabase
        .from('plants')
        .select('id')
        .eq('user_id', userId);

      if (plantsError) throw plantsError;
      
      if (!plants || plants.length === 0) {
        console.log('📝 No plants found for user, returning empty logs');
        return [];
      }

      const plantIds = plants.map(p => p.id);

      // Then get care logs for those plants
      let query = supabase
        .from('care_logs')
        .select('*')
        .in('plant_id', plantIds)
        .order('completed_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      console.log('📝 Care logs fetched:', data);
      return data || [];
    } catch (error) {
      console.error('❌ Error fetching care logs:', error);
      throw error;
    }
  },

  // Create a care log
  async createCareLog(log: Omit<CareLog, 'id' | 'created_at'>): Promise<CareLog> {
    try {
      console.log('➕ Creating care log:', log);
      
      const { data, error } = await supabase
        .from('care_logs')
        .insert([log])
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error creating care log:', error);
        throw error;
      }
      
      console.log('✅ Care log created successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error creating care log:', error);
      throw error;
    }
  }
};

// Profile CRUD Operations
export const profileService = {
  // Get user profile
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      console.log('🔍 Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - profile doesn't exist
          console.log('📝 No profile found for user:', userId);
          return null;
        }
        console.error('❌ Supabase error fetching profile:', error);
        throw error;
      }
      
      console.log('✅ Profile fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Create user profile
  async createProfile(profile: Omit<Profile, 'id' | 'created_at' | 'updated_at'>): Promise<Profile> {
    try {
      console.log('🔄 Creating profile:', profile);
      
      const { data, error } = await supabase
        .from('profiles')
        .insert([profile])
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error creating profile:', error);
        throw error;
      }
      
      console.log('✅ Profile created successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error creating profile:', error);
      throw error;
    }
  }
};

// Dashboard service for aggregated data
export const dashboardService = {
  async getDashboardData(userId: string) {
    try {
      const [plants, careSchedules, recentLogs] = await Promise.all([
        plantService.getPlants(userId),
        careScheduleService.getDueToday(userId),
        careLogService.getCareLogs(userId, 10)
      ]);

      return {
        plants,
        careSchedules,
        recentLogs,
        stats: {
          totalPlants: plants.length,
          dueToday: careSchedules.length,
          healthyPlants: plants.filter(p => p.health_score >= 80).length,
          needAttention: plants.filter(p => p.health_score < 80).length
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
};

// User Listing CRUD Operations
export const listingService = {
  // Get all active listings
  async getActiveListings(): Promise<UserListing[]> {
    try {
      // Fetch listings with plants
      const { data: listingsData, error: listingsError } = await supabase
        .from('user_listings')
        .select(`
          *,
          plants(*)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (listingsError) throw listingsError;
      
      // Fetch profiles separately for each listing
      const listingsWithProfiles = await Promise.all(
        (listingsData || []).map(async (listing) => {
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', listing.user_id)
              .single();
            
            return {
              ...listing,
              profiles: profileData
            };
          } catch (profileError) {
            console.error('Error fetching profile for listing:', listing.id, profileError);
            return {
              ...listing,
              profiles: null
            };
          }
        })
      );

      return listingsWithProfiles;
    } catch (error) {
      console.error('Error fetching active listings:', error);
      throw error;
    }
  },

  // Get user's own listings
  async getUserListings(userId: string): Promise<UserListing[]> {
    try {
      // Fetch listings with plants
      const { data: listingsData, error: listingsError } = await supabase
        .from('user_listings')
        .select(`
          *,
          plants(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (listingsError) throw listingsError;
      
      // Fetch profiles separately for each listing
      const listingsWithProfiles = await Promise.all(
        (listingsData || []).map(async (listing) => {
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', listing.user_id)
              .single();
            
            return {
              ...listing,
              profiles: profileData
            };
          } catch (profileError) {
            console.error('Error fetching profile for listing:', listing.id, profileError);
            return {
              ...listing,
              profiles: null
            };
          }
        })
      );

      return listingsWithProfiles;
    } catch (error) {
      console.error('Error fetching user listings:', error);
      throw error;
    }
  },

  // Get a single listing
  async getListing(listingId: string): Promise<UserListing | null> {
    try {
      // Fetch listing with plants
      const { data: listingData, error: listingError } = await supabase
        .from('user_listings')
        .select(`
          *,
          plants(*)
        `)
        .eq('id', listingId)
        .single();

      if (listingError) throw listingError;
      
      if (listingData) {
        // Fetch profile separately
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', listingData.user_id)
            .single();
          
          return {
            ...listingData,
            profiles: profileData
          };
        } catch (profileError) {
          console.error('Error fetching profile for listing:', listingId, profileError);
          return {
            ...listingData,
            profiles: null
          };
        }
      }
      
      return listingData;
    } catch (error) {
      console.error('Error fetching listing:', error);
      throw error;
    }
  },

  // Create a new listing
  async createListing(listing: Omit<UserListing, 'id' | 'created_at' | 'updated_at' | 'views_count'>): Promise<UserListing> {
    try {
      const { data, error } = await supabase
        .from('user_listings')
        .insert([listing])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  },

  // Update a listing
  async updateListing(listingId: string, updates: Partial<UserListing>): Promise<UserListing> {
    try {
      const { data, error } = await supabase
        .from('user_listings')
        .update(updates)
        .eq('id', listingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  },

  // Complete purchase using database function
  async completePurchase(
    listingId: string,
    buyerId: string,
    buyerName: string,
    buyerEmail: string,
    buyerPhone: string,
    deliveryAddress: string,
    deliveryInstructions: string
  ): Promise<any> {
    try {
      const { data, error } = await supabase.rpc('complete_purchase', {
        listing_id_param: listingId,
        buyer_id_param: buyerId,
        buyer_name_param: buyerName,
        buyer_email_param: buyerEmail,
        buyer_phone_param: buyerPhone,
        delivery_address_param: deliveryAddress,
        delivery_instructions_param: deliveryInstructions
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error completing purchase:', error);
      throw error;
    }
  },

  // Delete a listing
  async deleteListing(listingId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_listings')
        .delete()
        .eq('id', listingId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting listing:', error);
      throw error;
    }
  }
};

// Notification Service
export const notificationService = {
  // Get user's notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Send notification (using the database function)
  async sendNotification(
    targetUserId: string,
    title: string,
    message: string,
    type: 'sale' | 'purchase' | 'system' | 'message' = 'system',
    relatedListingId?: string,
    relatedUserId?: string
  ): Promise<string> {
    try {
      const { data, error } = await supabase.rpc('send_notification', {
        target_user_id: targetUserId,
        notification_title: title,
        notification_message: message,
        notification_type: type,
        related_listing_id: relatedListingId,
        related_user_id: relatedUserId
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }
};

// Disease Detection Service
export const diseaseDetectionService = {
  // Analyze plant image for disease detection
  async analyzeImage(imageFile: File): Promise<any> {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', imageFile);

      // Replace this URL with your actual disease detection model API endpoint
      const response = await fetch('/api/disease-detection', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  },

  // Get disease information by ID
  async getDiseaseInfo(diseaseId: string): Promise<any> {
    try {
      const response = await fetch(`/api/diseases/${diseaseId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch disease information');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching disease info:', error);
      throw error;
    }
  }
};