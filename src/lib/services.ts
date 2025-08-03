import { supabase, Plant, CareSchedule, CareLog, Profile } from './supabase';

// Plant CRUD Operations
export const plantService = {
  // Get all plants for a user
  async getPlants(userId: string): Promise<Plant[]> {
    try {
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching plants:', error);
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
      const { data, error } = await supabase
        .from('plants')
        .insert([plant])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating plant:', error);
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
      const { data, error } = await supabase
        .from('care_schedules')
        .select('*, plants(*)')
        .eq('plants.user_id', userId)
        .order('next_due_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching care schedules:', error);
      throw error;
    }
  },

  // Get care schedules due today
  async getDueToday(userId: string): Promise<CareSchedule[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('care_schedules')
        .select('*, plants(*)')
        .eq('plants.user_id', userId)
        .eq('is_active', true)
        .lte('next_due_date', today)
        .order('next_due_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching due schedules:', error);
      throw error;
    }
  },

  // Create a care schedule
  async createCareSchedule(schedule: Omit<CareSchedule, 'id' | 'created_at' | 'updated_at'>): Promise<CareSchedule> {
    try {
      const { data, error } = await supabase
        .from('care_schedules')
        .insert([schedule])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating care schedule:', error);
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
  }
};

// Care Log CRUD Operations
export const careLogService = {
  // Get care logs for a user
  async getCareLogs(userId: string, limit?: number): Promise<CareLog[]> {
    try {
      let query = supabase
        .from('care_logs')
        .select('*, plants(*)')
        .eq('plants.user_id', userId)
        .order('completed_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching care logs:', error);
      throw error;
    }
  },

  // Create a care log
  async createCareLog(log: Omit<CareLog, 'id' | 'created_at'>): Promise<CareLog> {
    try {
      const { data, error } = await supabase
        .from('care_logs')
        .insert([log])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating care log:', error);
      throw error;
    }
  }
};

// Profile CRUD Operations
export const profileService = {
  // Get user profile
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
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
      const { data, error } = await supabase
        .from('profiles')
        .insert([profile])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
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