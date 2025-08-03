import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Droplets, 
  Sun, 
  Scissors, 
  Thermometer,
  Bell,
  CheckCircle,
  Clock,
  AlertTriangle,
  Leaf,
  Settings,
  X,
  Calendar,
  Users
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface CareEvent {
  id: number;
  plant: string;
  type: 'water' | 'fertilize' | 'prune' | 'repot' | 'mist' | 'rotate';
  date: Date;
  completed: boolean;
  icon: any;
  color: string;
  priority: 'high' | 'medium' | 'low';
  notification: boolean;
}

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onAddTask: (task: Omit<CareEvent, 'id'>) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, selectedDate, onAddTask }) => {
  const [plant, setPlant] = useState('');
  const [careType, setCareType] = useState<CareEvent['type']>('water');
  const [priority, setPriority] = useState<CareEvent['priority']>('medium');
  const [notification, setNotification] = useState(true);

  const careTypes = [
    { value: 'water', label: 'Water', icon: Droplets, color: 'bg-blue-500' },
    { value: 'fertilize', label: 'Fertilize', icon: Sun, color: 'bg-yellow-500' },
    { value: 'prune', label: 'Prune', icon: Scissors, color: 'bg-green-500' },
    { value: 'repot', label: 'Repot', icon: Leaf, color: 'bg-purple-500' },
    { value: 'mist', label: 'Mist', icon: Droplets, color: 'bg-cyan-500' },
    { value: 'rotate', label: 'Rotate', icon: Thermometer, color: 'bg-orange-500' },
  ];

  const plants = [
    'Monstera Deliciosa',
    'Snake Plant',
    'Peace Lily',
    'Fiddle Leaf Fig',
    'Pothos',
    'ZZ Plant',
    'Philodendron',
    'Aloe Vera'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plant.trim()) return;

    const selectedCareType = careTypes.find(ct => ct.value === careType);
    if (!selectedCareType) return;

    const newTask: Omit<CareEvent, 'id'> = {
      plant: plant.trim(),
      type: careType,
      date: selectedDate,
      completed: false,
      icon: selectedCareType.icon,
      color: selectedCareType.color,
      priority,
      notification
    };

    onAddTask(newTask);
    onClose();
    
    // Reset form
    setPlant('');
    setCareType('water');
    setPriority('medium');
    setNotification(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-green-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-green-900">Add Care Task</h3>
            <button
              onClick={onClose}
              className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4 p-3 bg-green-50 rounded-xl">
            <p className="text-sm text-green-600 font-medium">Selected Date:</p>
            <p className="text-green-900 font-semibold">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-green-900 mb-2">
                Plant
              </label>
              <select
                value={plant}
                onChange={(e) => setPlant(e.target.value)}
                className="input-primary"
                required
              >
                <option value="">Select a plant</option>
                {plants.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-green-900 mb-2">
                Care Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {careTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setCareType(type.value as CareEvent['type'])}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 flex items-center space-x-2 ${
                        careType === type.value
                          ? 'border-green-500 bg-green-50'
                          : 'border-green-200 hover:border-green-300'
                      }`}
                    >
                      <div className={`p-1 rounded ${type.color}`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-green-900">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-green-900 mb-2">
                Priority
              </label>
              <div className="flex space-x-2">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-2 px-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                      priority === p
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-green-200 text-green-600 hover:border-green-300'
                    }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="notification"
                checked={notification}
                onChange={(e) => setNotification(e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <label htmlFor="notification" className="text-sm text-green-700">
                Send notification reminder
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 border-2 border-green-200 text-green-700 rounded-xl font-medium hover:bg-green-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-gradient-green text-white rounded-xl font-medium hover:shadow-green-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const PlantCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [showAddTask, setShowAddTask] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [careEvents, setCareEvents] = useState<CareEvent[]>([
    {
      id: 1,
      plant: 'Monstera Deliciosa',
      type: 'water',
      date: new Date(2025, 0, 15),
      completed: true,
      icon: Droplets,
      color: 'bg-blue-500',
      priority: 'high',
      notification: true
    },
    {
      id: 2,
      plant: 'Snake Plant',
      type: 'fertilize',
      date: new Date(2025, 0, 16),
      completed: false,
      icon: Sun,
      color: 'bg-yellow-500',
      priority: 'medium',
      notification: true
    },
    {
      id: 3,
      plant: 'Peace Lily',
      type: 'prune',
      date: new Date(2025, 0, 17),
      completed: false,
      icon: Scissors,
      color: 'bg-green-500',
      priority: 'low',
      notification: false
    },
    {
      id: 4,
      plant: 'Fiddle Leaf Fig',
      type: 'water',
      date: new Date(2025, 0, 18),
      completed: false,
      icon: Droplets,
      color: 'bg-blue-500',
      priority: 'high',
      notification: true
    },
  ]);
  const { showToast } = useToast();

  const todayEvents = careEvents.filter(event => 
    event.date.toDateString() === new Date().toDateString()
  );

  const upcomingEvents = careEvents.filter(event => 
    event.date > new Date() && event.date <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  const handleTaskComplete = (eventId: number) => {
    setCareEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, completed: !event.completed } : event
    ));
    showToast('success', 'Task completed!', 'Great job taking care of your plants!');
  };

  const handleAddTask = () => {
    setShowAddTask(true);
  };

  const handleAddTaskSubmit = (newTask: Omit<CareEvent, 'id'>) => {
    const taskWithId: CareEvent = {
      ...newTask,
      id: Date.now()
    };
    setCareEvents(prev => [...prev, taskWithId]);
    showToast('success', 'Task added!', `Added ${newTask.type} task for ${newTask.plant}`);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowAddTask(true);
  };

  const handleNotificationToggle = () => {
    setNotifications(!notifications);
    showToast(
      notifications ? 'warning' : 'success',
      notifications ? 'Notifications disabled' : 'Notifications enabled',
      notifications ? 'You won\'t receive care reminders' : 'You\'ll receive care reminders'
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const totalDays = Math.ceil((startingDayOfWeek + daysInMonth) / 7) * 7;

  const getEventsForDate = (date: Date) => {
    return careEvents.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  return (
    <div className="space-y-6 mt-16 lg:mt-0 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-green rounded-2xl flex items-center justify-center shadow-green">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-green-900">Plant Calendar</h1>
            <p className="text-green-600">Schedule and track your plant care tasks</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Notification Toggle */}
          <button
            onClick={handleNotificationToggle}
            className={`p-3 rounded-xl transition-all duration-200 ${
              notifications 
                ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Bell className="w-5 h-5" />
          </button>
          
          {/* View Toggle */}
          <div className="flex bg-green-100 rounded-xl p-1">
            {['month', 'week', 'day'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v as 'month' | 'week' | 'day')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  view === v 
                    ? 'bg-white text-green-600 shadow-sm' 
                    : 'text-green-600 hover:text-green-700'
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Add Task Button */}
          <button 
            onClick={handleAddTask}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-green-900">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="p-2 hover:bg-green-50 rounded-xl transition-colors"
              >
                <span className="text-green-600">&lt;</span>
              </button>
              <button 
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-2 hover:bg-green-50 rounded-xl transition-colors"
              >
                <span className="text-green-600">&gt;</span>
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-3 text-center text-sm font-semibold text-green-600">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: totalDays }, (_, i) => {
              const dayOffset = i - startingDayOfWeek;
              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayOffset + 1);
              const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
              const isToday = date.toDateString() === new Date().toDateString();
              const dayEvents = getEventsForDate(date);

              return (
                <div
                  key={i}
                  onClick={() => handleDateClick(date)}
                  className={`
                    p-3 text-center text-sm cursor-pointer rounded-xl transition-all duration-200 min-h-[80px] relative hover:bg-green-50
                    ${isCurrentMonth ? 'text-green-900' : 'text-green-400'}
                    ${isToday ? 'bg-gradient-green text-white shadow-green-lg' : ''}
                    ${dayEvents.length > 0 ? 'bg-green-50 border-2 border-green-200' : ''}
                  `}
                >
                  <span className={`font-semibold ${isToday ? 'text-white' : ''}`}>
                    {date.getDate()}
                  </span>
                  
                  {/* Event indicators */}
                  {dayEvents.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`w-2 h-2 rounded-full mx-auto ${event.color} ${isToday ? 'bg-white' : ''}`}
                        />
                      ))}
                      {dayEvents.length > 2 && (
                        <div className={`text-xs ${isToday ? 'text-white' : 'text-green-600'}`}>
                          +{dayEvents.length - 2}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tasks Sidebar */}
        <div className="space-y-6">
          {/* Today's Tasks */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-green-900">Today's Tasks</h3>
              <span className="text-sm text-green-600">{todayEvents.length} tasks</span>
            </div>
            
            <div className="space-y-3">
              {todayEvents.length === 0 ? (
                <div className="text-center py-8">
                  <Leaf className="w-12 h-12 text-green-300 mx-auto mb-3" />
                  <p className="text-green-600 font-medium">No tasks for today</p>
                  <p className="text-sm text-green-500 mt-1">Your plants are all set!</p>
                </div>
              ) : (
                todayEvents.map((event) => {
                  const Icon = event.icon;
                  return (
                    <div 
                      key={event.id} 
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${getPriorityColor(event.priority)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${event.color}`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-green-900">{event.plant}</p>
                            <p className="text-sm text-green-600 capitalize">{event.type}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {getPriorityIcon(event.priority)}
                          <button
                            onClick={() => handleTaskComplete(event.id)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              event.completed 
                                ? 'bg-green-500 text-white' 
                                : 'bg-white text-green-600 hover:bg-green-50'
                            }`}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-green-900 mb-4">This Week</h3>
            <div className="space-y-3">
              {upcomingEvents.map((event) => {
                const Icon = event.icon;
                return (
                  <div key={event.id} className="p-3 rounded-xl hover:bg-green-50 transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${event.color}`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-900">{event.plant}</p>
                        <p className="text-sm text-green-600 capitalize">{event.type}</p>
                        <p className="text-xs text-green-500">
                          {event.date.toLocaleDateString()}
                        </p>
                      </div>
                      {event.notification && (
                        <Bell className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-green-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-green-600">Tasks Completed</span>
                <span className="font-bold text-green-900">
                  {careEvents.filter(e => e.completed).length}/{careEvents.length}
                </span>
              </div>
              <div className="w-full bg-green-100 rounded-full h-2">
                <div 
                  className="bg-gradient-green h-2 rounded-full" 
                  style={{ 
                    width: `${careEvents.length > 0 ? (careEvents.filter(e => e.completed).length / careEvents.length) * 100 : 0}%` 
                  }} 
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600">Success Rate</span>
                <span className="font-semibold text-green-900">
                  {careEvents.length > 0 ? Math.round((careEvents.filter(e => e.completed).length / careEvents.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={showAddTask}
        onClose={() => setShowAddTask(false)}
        selectedDate={selectedDate}
        onAddTask={handleAddTaskSubmit}
      />
    </div>
  );
};

export default PlantCalendar;