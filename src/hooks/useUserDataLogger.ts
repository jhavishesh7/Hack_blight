import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { useData } from '../contexts/DataContext';
import UserDataLogger from '../lib/userDataLogger';

export const useUserDataLogger = () => {
  const { user, profile } = useAuth();
  const { plants, careSchedules, recentLogs } = useData();
  const hasLogged = useRef(false);

  const logUserData = async () => {
    if (!user || hasLogged.current) {
      return;
    }

    try {
      console.log('🔄 Triggering user data logging for AI chatbot access...');
      
      const logger = UserDataLogger.getInstance();
      await logger.logUserData(
        user,
        profile,
        plants,
        careSchedules,
        recentLogs
      );
      
      hasLogged.current = true;
      console.log('✅ User data logged successfully for AI chatbot session');
      
    } catch (error) {
      console.error('❌ Error logging user data:', error);
    }
  };

  const resetLogging = () => {
    hasLogged.current = false;
  };

  return {
    logUserData,
    resetLogging,
    hasLogged: hasLogged.current
  };
}; 