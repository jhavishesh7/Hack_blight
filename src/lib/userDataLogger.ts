import { useAuth } from '../hooks/useAuth';
import { useData } from '../contexts/DataContext';
import { listingService } from './services';
import { Plant, CareSchedule, CareLog, UserListing, Profile } from './supabase';

export interface UserDataLog {
  timestamp: string;
  sessionId: string;
  user: {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at: string;
    user_metadata: any;
  };
  profile: Profile | null;
  plants: Plant[];
  careSchedules: CareSchedule[];
  recentCareLogs: CareLog[];
  userListings: UserListing[];
  systemInfo: {
    userAgent: string;
    screenResolution: string;
    timezone: string;
    language: string;
    platform: string;
  };
  appUsage: {
    currentPage: string;
    totalPlants: number;
    totalTasks: number;
    totalListings: number;
    activeCareSchedules: number;
    completedTasksToday: number;
  };
}

class UserDataLogger {
  private static instance: UserDataLogger;
  private isLogging = false;

  private constructor() {}

  public static getInstance(): UserDataLogger {
    if (!UserDataLogger.instance) {
      UserDataLogger.instance = new UserDataLogger();
    }
    return UserDataLogger.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getSystemInfo() {
    return {
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform
    };
  }

  private calculateAppUsage(plants: Plant[], careSchedules: CareSchedule[], userListings: UserListing[]) {
    const today = new Date().toISOString().split('T')[0];
    const completedTasksToday = careSchedules.filter(schedule => 
      schedule.last_completed_date === today
    ).length;

    return {
      currentPage: 'expert-chat',
      totalPlants: plants.length,
      totalTasks: careSchedules.length,
      totalListings: userListings.length,
      activeCareSchedules: careSchedules.filter(s => s.is_active).length,
      completedTasksToday
    };
  }

  public async logUserData(
    user: any,
    profile: Profile | null,
    plants: Plant[],
    careSchedules: CareSchedule[],
    recentLogs: CareLog[]
  ): Promise<void> {
    if (this.isLogging) {
      console.log('🔄 User data logging already in progress, skipping...');
      return;
    }

    this.isLogging = true;
    
    try {
      console.log('📊 Starting user data logging...');
      
      // Fetch user listings
      let userListings: UserListing[] = [];
      try {
        userListings = await listingService.getUserListings(user.id);
        console.log('✅ User listings fetched:', userListings.length);
      } catch (error) {
        console.error('❌ Error fetching user listings:', error);
      }

      // Create comprehensive user data log
      const userDataLog: UserDataLog = {
        timestamp: new Date().toISOString(),
        sessionId: this.generateSessionId(),
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          user_metadata: user.user_metadata
        },
        profile,
        plants,
        careSchedules,
        recentCareLogs: recentLogs,
        userListings,
        systemInfo: this.getSystemInfo(),
        appUsage: this.calculateAppUsage(plants, careSchedules, userListings)
      };

      // Log to console for debugging (in production, this would be removed)
      console.log('📊 User Data Log:', {
        timestamp: userDataLog.timestamp,
        sessionId: userDataLog.sessionId,
        userId: userDataLog.user.id,
        totalPlants: userDataLog.appUsage.totalPlants,
        totalTasks: userDataLog.appUsage.totalTasks,
        totalListings: userDataLog.appUsage.totalListings
      });

      // Send data to backend instead of downloading locally
      await this.sendToBackend(userDataLog);
      
      console.log('✅ User data logging completed successfully');
      
    } catch (error) {
      console.error('❌ Error during user data logging:', error);
    } finally {
      this.isLogging = false;
    }
  }

  // Method to send data to backend
  private async sendToBackend(userDataLog: UserDataLog): Promise<void> {
    try {
      console.log('📤 Sending user data to backend...');
      
      // Send data to your backend endpoint
      const response = await fetch('http://localhost:3001/api/user-data-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDataLog)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send user data to backend: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('📤 User data sent to backend successfully:', result);
    } catch (error) {
      console.error('❌ Error sending user data to backend:', error);
      
      // Fallback: Create downloadable log if backend fails
      console.log('🔄 Backend failed, creating downloadable log as fallback...');
      await this.createDownloadableLog(userDataLog);
    }
  }

  // Fallback method to create downloadable log (kept for backup)
  private async createDownloadableLog(userDataLog: UserDataLog): Promise<void> {
    try {
      // Create a blob with the JSON data
      const jsonString = JSON.stringify(userDataLog, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // Create a temporary download link (hidden from user)
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `user_data_${userDataLog.user.id}_${Date.now()}.json`;
      
      // Trigger download silently (user won't see this)
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      URL.revokeObjectURL(url);
      
      console.log('📁 User data log file created and downloaded (fallback)');
    } catch (error) {
      console.error('❌ Error creating downloadable log:', error);
    }
  }

  // Public method to trigger logging from components
  public static async logCurrentUserData(): Promise<void> {
    try {
      // This method would be called from the ExpertChat component
      // It would need access to the current user context and data
      console.log('🔄 User data logging triggered');
    } catch (error) {
      console.error('❌ Error triggering user data logging:', error);
    }
  }
}

export default UserDataLogger; 