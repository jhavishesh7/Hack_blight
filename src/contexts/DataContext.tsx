import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Plant, CareSchedule, CareLog } from '../lib/supabase';
import { plantService, careScheduleService, careLogService } from '../lib/services';
import { useAuth } from '../hooks/useAuth';

interface DataContextType {
  plants: Plant[];
  careSchedules: CareSchedule[];
  recentLogs: CareLog[];
  loading: boolean;
  refreshPlants: () => Promise<void>;
  refreshCareSchedules: () => Promise<void>;
  refreshRecentLogs: () => Promise<void>;
  refreshAll: () => Promise<void>;
  clearData: () => void;
  addPlant: (plant: Plant) => void;
  updatePlant: (plant: Plant) => void;
  deletePlant: (plantId: string) => void;
  addCareSchedule: (schedule: CareSchedule) => void;
  updateCareSchedule: (schedule: CareSchedule) => void;
  deleteCareSchedule: (scheduleId: string) => void;
  addCareLog: (log: CareLog) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [careSchedules, setCareSchedules] = useState<CareSchedule[]>([]);
  const [recentLogs, setRecentLogs] = useState<CareLog[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshPlants = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      console.log('🔄 Refreshing plants for user:', user.id);
      const plantsData = await plantService.getPlants(user.id);
      console.log('✅ Plants fetched:', plantsData);
      setPlants(plantsData);
    } catch (error) {
      console.error('❌ Error refreshing plants:', error);
    }
  }, [user?.id]);

  const refreshCareSchedules = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      console.log('🔄 Refreshing care schedules for user:', user.id);
      const schedulesData = await careScheduleService.getCareSchedules(user.id);
      console.log('✅ Care schedules fetched:', schedulesData);
      setCareSchedules(schedulesData);
    } catch (error) {
      console.error('❌ Error refreshing care schedules:', error);
    }
  }, [user?.id]);

  const refreshRecentLogs = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const logsData = await careLogService.getCareLogs(user.id, 10);
      setRecentLogs(logsData);
    } catch (error) {
      console.error('Error refreshing recent logs:', error);
    }
  }, [user?.id]);

  const refreshAll = useCallback(async () => {
    if (!user?.id) return;
    
    console.log('🔄 DataContext: Refreshing all data for user:', user.id);
    setLoading(true);
    try {
      await Promise.all([
        refreshPlants(),
        refreshCareSchedules(),
        refreshRecentLogs()
      ]);
      console.log('✅ DataContext: All data refreshed successfully');
    } catch (error) {
      console.error('❌ DataContext: Error refreshing all data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, refreshPlants, refreshCareSchedules, refreshRecentLogs]);

  const addPlant = useCallback((plant: Plant) => {
    setPlants(prev => [plant, ...prev]);
  }, []);

  const updatePlant = useCallback((plant: Plant) => {
    setPlants(prev => prev.map(p => p.id === plant.id ? plant : p));
  }, []);

  const deletePlant = useCallback((plantId: string) => {
    setPlants(prev => prev.filter(p => p.id !== plantId));
  }, []);

  const addCareSchedule = useCallback((schedule: CareSchedule) => {
    setCareSchedules(prev => [schedule, ...prev]);
  }, []);

  const updateCareSchedule = useCallback((schedule: CareSchedule) => {
    setCareSchedules(prev => prev.map(s => s.id === schedule.id ? schedule : s));
  }, []);

  const deleteCareSchedule = useCallback((scheduleId: string) => {
    setCareSchedules(prev => prev.filter(s => s.id !== scheduleId));
  }, []);

  const addCareLog = useCallback((log: CareLog) => {
    setRecentLogs(prev => [log, ...prev]);
  }, []);

  const clearData = useCallback(() => {
    setPlants([]);
    setCareSchedules([]);
    setRecentLogs([]);
    setLoading(false);
  }, []);

  // Initial data load
  useEffect(() => {
    if (user) {
      refreshAll();
    } else {
      setLoading(false);
    }
  }, [user, refreshAll]);

  // Refresh data when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        refreshAll();
      }
    };

    const handleFocus = () => {
      if (user) {
        refreshAll();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user, refreshAll]);

  const value: DataContextType = {
    plants,
    careSchedules,
    recentLogs,
    loading,
    refreshPlants,
    refreshCareSchedules,
    refreshRecentLogs,
    refreshAll,
    clearData,
    addPlant,
    updatePlant,
    deletePlant,
    addCareSchedule,
    updateCareSchedule,
    deleteCareSchedule,
    addCareLog
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}; 