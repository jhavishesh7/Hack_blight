import React from 'react';
import { useState, useEffect } from 'react';
import { Plant, CareSchedule, CareLog } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { dashboardService } from '../lib/services';
import { useToast } from '../contexts/ToastContext';
import LoadingSpinner from './LoadingSpinner';
import PlantManagement from './PlantManagement';
import { 
  Droplets, 
  Sun, 
  Thermometer, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Plus
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [careSchedules, setCareSchedules] = useState<CareSchedule[]>([]);
  const [recentLogs, setRecentLogs] = useState<CareLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const dashboardData = await dashboardService.getDashboardData(user.id);
      
      setPlants(dashboardData.plants);
      setCareSchedules(dashboardData.careSchedules);
      setRecentLogs(dashboardData.recentLogs);
      
      showToast('success', 'Dashboard loaded successfully', 'Your plant data is ready!');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showToast('error', 'Failed to load dashboard', 'Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { title: 'Total Plants', value: plants.length.toString(), icon: Sun, color: 'bg-green-500' },
    { title: 'Due Today', value: careSchedules.length.toString(), icon: Droplets, color: 'bg-blue-500' },
    { title: 'Healthy Plants', value: plants.filter(p => p.health_score >= 80).length.toString(), icon: CheckCircle, color: 'bg-emerald-500' },
    { title: 'Need Attention', value: plants.filter(p => p.health_score < 80).length.toString(), icon: AlertTriangle, color: 'bg-yellow-500' },
  ];

  if (loading) {
    return (
      <div>
        <LoadingSpinner 
          size="lg" 
          text="Loading your plant dashboard..." 
          fullScreen={false} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-green-900">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-green-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Plant Management */}
      <PlantManagement 
        onPlantAdded={(plant) => {
          setPlants([plant, ...plants]);
          showToast('success', 'Plant added to dashboard', `${plant.name} is now in your collection!`);
        }}
        onPlantUpdated={(plant) => {
          setPlants(plants.map(p => p.id === plant.id ? plant : p));
          showToast('success', 'Plant updated', `${plant.name} has been updated successfully!`);
        }}
        onPlantDeleted={(plantId) => {
          setPlants(plants.filter(p => p.id !== plantId));
          showToast('success', 'Plant removed', 'Plant has been removed from your collection.');
        }}
      />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-green-900 mb-4">Recent Care Activities</h2>
          <div className="space-y-4">
            {recentLogs.length === 0 ? (
              <p className="text-green-600 text-center py-8">No recent care activities</p>
            ) : (
              recentLogs.map((log) => (
                <div key={log.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Droplets className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-green-900">{log.care_type}</p>
                    <p className="text-sm text-green-600">
                      {new Date(log.completed_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-green-900 mb-4">Today's Tasks</h2>
          <div className="space-y-4">
            {careSchedules.length === 0 ? (
              <p className="text-green-600 text-center py-8">No tasks due today</p>
            ) : (
              careSchedules.map((schedule) => (
                <div key={schedule.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-xl">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-green-900">{schedule.care_type}</p>
                    <p className="text-sm text-green-600">
                      Due: {new Date(schedule.next_due_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;