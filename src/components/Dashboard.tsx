import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from './LoadingSpinner';
import PlantManagement from './PlantManagement';
import TaskManagement from './TaskManagement';

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
  const location = useLocation();
  const { plants, careSchedules, recentLogs, loading, addPlant, updatePlant, deletePlant, refreshAll } = useData();

  // Show success message when data is loaded
  React.useEffect(() => {
    if (!loading && plants.length > 0) {
      showToast('success', 'Dashboard loaded successfully', 'Your plant data is ready!');
    }
  }, [loading, plants.length, showToast]);



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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your plants today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="w-4 h-4 inline mr-2" />
            Today
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4 inline mr-2" />
            Add Plant
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                  <Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>



      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Plant Management - Takes 2 columns */}
        <div className="xl:col-span-2 space-y-8">
          <PlantManagement 
            onPlantAdded={(plant) => {
              showToast('success', 'Plant added to dashboard', `${plant.name} is now in your collection!`);
            }}
            onPlantUpdated={(plant) => {
              showToast('success', 'Plant updated', `${plant.name} has been updated successfully!`);
            }}
            onPlantDeleted={(plantId) => {
              showToast('success', 'Plant removed', 'Plant has been removed from your collection.');
            }}
          />
          
          <TaskManagement 
            onTaskAdded={(task) => {
              showToast('success', 'Task created', 'Your care task has been scheduled successfully!');
            }}
            onTaskCompleted={(taskId) => {
              showToast('success', 'Task completed', 'Great job! Task marked as completed.');
            }}
            onTaskDeleted={(taskId) => {
              showToast('success', 'Task deleted', 'Task has been removed from your schedule.');
            }}
          />
        </div>

        {/* Sidebar - Takes 1 column */}
        <div className="space-y-6">
          {/* Today's Tasks */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Today's Tasks</h2>
              <span className="text-sm text-gray-500">{careSchedules.length} due</span>
            </div>
            <div className="space-y-3">
              {careSchedules.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No tasks due today</p>
                </div>
              ) : (
                careSchedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Calendar className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{schedule.care_type}</p>
                      <p className="text-xs text-gray-500">
                        Due: {new Date(schedule.next_due_date).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="p-1 text-amber-600 hover:bg-amber-100 rounded transition-colors">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <span className="text-sm text-gray-500">{recentLogs.length} activities</span>
            </div>
            <div className="space-y-3">
              {recentLogs.length === 0 ? (
                <div className="text-center py-6">
                  <Droplets className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No recent activities</p>
                </div>
              ) : (
                recentLogs.map((log) => (
                  <div key={log.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Droplets className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{log.care_type}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(log.completed_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 text-left bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors">
                <Plus className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Add New Plant</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Schedule Care</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">View Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;