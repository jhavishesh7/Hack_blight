import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { useData } from '../contexts/DataContext';
import { careScheduleService, careLogService } from '../lib/services';
import { CareSchedule, Plant } from '../lib/supabase';
import { 
  Plus, 
  Calendar, 
  Droplets, 
  Sun, 
  Scissors, 
  Leaf, 
  Thermometer,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Edit,
  Trash2
} from 'lucide-react';

interface TaskManagementProps {
  onTaskAdded?: (task: CareSchedule) => void;
  onTaskCompleted?: (taskId: string) => void;
  onTaskDeleted?: (taskId: string) => void;
}

const TaskManagement: React.FC<TaskManagementProps> = ({
  onTaskAdded,
  onTaskCompleted,
  onTaskDeleted
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { plants, careSchedules, refreshCareSchedules } = useData();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    plant_id: '',
    care_type: 'water' as CareSchedule['care_type'],
    frequency_days: 7,
    next_due_date: new Date().toISOString().split('T')[0],
    is_active: true
  });

  const careTypes = [
    { value: 'water', label: 'Water', icon: Droplets, color: 'bg-blue-500' },
    { value: 'fertilize', label: 'Fertilize', icon: Sun, color: 'bg-yellow-500' },
    { value: 'prune', label: 'Prune', icon: Scissors, color: 'bg-green-500' },
    { value: 'repot', label: 'Repot', icon: Leaf, color: 'bg-purple-500' },
    { value: 'mist', label: 'Mist', icon: Droplets, color: 'bg-cyan-500' },
    { value: 'rotate', label: 'Rotate', icon: Thermometer, color: 'bg-orange-500' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('➕ TaskManagement: Submitting form');
    console.log('👤 User ID:', user?.id);
    console.log('📋 Form data:', formData);
    
    if (!user?.id || !formData.plant_id) {
      console.error('❌ Missing information:', { userId: user?.id, plantId: formData.plant_id });
      showToast('error', 'Missing information', 'Please select a plant and fill all required fields.');
      return;
    }

    setLoading(true);
    try {
      const scheduleData = {
        plant_id: formData.plant_id,
        care_type: formData.care_type,
        frequency_days: formData.frequency_days,
        next_due_date: formData.next_due_date,
        is_active: formData.is_active
      };

      console.log('📋 Creating schedule with data:', scheduleData);

      const newSchedule = await careScheduleService.createCareSchedule(scheduleData);

      console.log('✅ Schedule created successfully:', newSchedule);

      await refreshCareSchedules();
      onTaskAdded?.(newSchedule);
      showToast('success', 'Task created successfully', 'Your care task has been scheduled.');
      closeModal();
    } catch (error) {
      console.error('❌ Error creating task:', error);
      showToast('error', 'Failed to create task', 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (scheduleId: string) => {
    if (!user?.id) return;

    try {
      // Get the schedule to create a care log
      const schedule = careSchedules.find(s => s.id === scheduleId);
      if (!schedule) return;

      // Create care log
      await careLogService.createCareLog({
        plant_id: schedule.plant_id,
        care_type: schedule.care_type,
        completed_at: new Date().toISOString(),
        notes: 'Completed via task management'
      });

      // Mark schedule as completed
      await careScheduleService.completeCareSchedule(scheduleId);
      
      // Update next due date
      const nextDueDate = new Date(schedule.next_due_date);
      nextDueDate.setDate(nextDueDate.getDate() + schedule.frequency_days);
      
      await careScheduleService.updateCareSchedule(scheduleId, {
        next_due_date: nextDueDate.toISOString().split('T')[0],
        is_active: true
      });

      await refreshCareSchedules();
      onTaskCompleted?.(scheduleId);
      showToast('success', 'Task completed', 'Great job! Task marked as completed.');
    } catch (error) {
      console.error('Error completing task:', error);
      showToast('error', 'Failed to complete task', 'Please try again.');
    }
  };

  const handleDeleteTask = async (scheduleId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      console.log('🗑️ Deleting task:', scheduleId);
      await careScheduleService.deleteCareSchedule(scheduleId);
      await refreshCareSchedules();
      onTaskDeleted?.(scheduleId);
      showToast('success', 'Task deleted', 'Task has been removed.');
    } catch (error) {
      console.error('❌ Error deleting task:', error);
      showToast('error', 'Failed to delete task', 'Please try again.');
    }
  };

  const openModal = () => {
    setFormData({
      plant_id: '',
      care_type: 'water',
      frequency_days: 7,
      next_due_date: new Date().toISOString().split('T')[0],
      is_active: true
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      plant_id: '',
      care_type: 'water',
      frequency_days: 7,
      next_due_date: new Date().toISOString().split('T')[0],
      is_active: true
    });
  };

  const getCareTypeIcon = (careType: string) => {
    const type = careTypes.find(t => t.value === careType);
    return type ? type.icon : Calendar;
  };

  const getCareTypeColor = (careType: string) => {
    const type = careTypes.find(t => t.value === careType);
    return type ? type.color : 'bg-gray-500';
  };

  const isOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today && due.toDateString() !== today.toDateString();
  };

  const isDueToday = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due.toDateString() === today.toDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Care Tasks</h2>
          <p className="text-gray-600 mt-1">Manage your plant care schedules and track completed tasks</p>
        </div>
        <button
          onClick={openModal}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Tasks List */}
      {careSchedules.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-600 mb-4">Start scheduling care tasks for your plants!</p>
          <button
            onClick={openModal}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            Create Your First Task
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {careSchedules.map((schedule) => {
            const Icon = getCareTypeIcon(schedule.care_type);
            const colorClass = getCareTypeColor(schedule.care_type);
            const plant = plants.find(p => p.id === schedule.plant_id);
            
            return (
              <div key={schedule.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${colorClass}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {schedule.care_type.charAt(0).toUpperCase() + schedule.care_type.slice(1)} {plant?.name}
                        </h3>
                        {isOverdue(schedule.next_due_date) && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Overdue
                          </span>
                        )}
                        {isDueToday(schedule.next_due_date) && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="w-3 h-3 mr-1" />
                            Due Today
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Due: {new Date(schedule.next_due_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Repeats every {schedule.frequency_days} day{schedule.frequency_days !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleCompleteTask(schedule.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Mark as completed"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(schedule.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add Care Task</h3>
              <button
                onClick={closeModal}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plant *
                </label>
                <select
                  value={formData.plant_id}
                  onChange={(e) => setFormData({ ...formData, plant_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Select a plant</option>
                  {plants.map((plant) => (
                    <option key={plant.id} value={plant.id}>{plant.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Care Type *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {careTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, care_type: type.value as CareSchedule['care_type'] })}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-2 ${
                          formData.care_type === type.value
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`p-1 rounded ${type.color}`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={formData.next_due_date}
                  onChange={(e) => setFormData({ ...formData, next_due_date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Repeat Every (days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.frequency_days}
                  onChange={(e) => setFormData({ ...formData, frequency_days: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Create Task</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement; 