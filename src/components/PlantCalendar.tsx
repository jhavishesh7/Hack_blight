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
  Users,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../hooks/useAuth';
import { careScheduleService, careLogService } from '../lib/services';
import { CareSchedule } from '../lib/supabase';

interface CalendarEvent {
  id: string;
  plant: string;
  type: CareSchedule['care_type'];
  date: Date;
  completed: boolean;
  icon: any;
  color: string;
  priority: 'high' | 'medium' | 'low';
  notification: boolean;
  scheduleId: string;
  plantId: string;
}

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onAddTask: (task: Omit<CalendarEvent, 'id' | 'completed' | 'scheduleId' | 'plantId'>) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, selectedDate, onAddTask }) => {
  const { plants } = useData();
  const [plantId, setPlantId] = useState('');
  const [careType, setCareType] = useState<CareSchedule['care_type']>('water');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [notification, setNotification] = useState(true);
  const [frequencyDays, setFrequencyDays] = useState(7);

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
    if (!plantId.trim()) return;

    const selectedPlant = plants.find(p => p.id === plantId);
    if (!selectedPlant) return;

    const selectedCareType = careTypes.find(ct => ct.value === careType);
    if (!selectedCareType) return;

    const newTask: Omit<CalendarEvent, 'id' | 'completed' | 'scheduleId' | 'plantId'> = {
      plant: selectedPlant.name,
      type: careType,
      date: selectedDate,
      icon: selectedCareType.icon,
      color: selectedCareType.color,
      priority,
      notification
    };

    onAddTask(newTask);
    onClose();
    
    // Reset form
    setPlantId('');
    setCareType('water');
    setPriority('medium');
    setNotification(true);
    setFrequencyDays(7);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Add Care Task</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4 p-3 bg-green-50 rounded-lg">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plant *
              </label>
              <select
                value={plantId}
                onChange={(e) => setPlantId(e.target.value)}
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
                      onClick={() => setCareType(type.value as CareSchedule['care_type'])}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-2 ${
                        careType === type.value
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
                Priority
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'low', label: 'Low', color: 'border-green-500 bg-green-50' },
                  { value: 'medium', label: 'Medium', color: 'border-yellow-500 bg-yellow-50' },
                  { value: 'high', label: 'High', color: 'border-red-500 bg-red-50' }
                ].map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value as 'high' | 'medium' | 'low')}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      priority === p.value ? p.color : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-900">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repeat Every (days)
              </label>
              <input
                type="number"
                min="1"
                value={frequencyDays}
                onChange={(e) => setFrequencyDays(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const PlantCalendar: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { plants, careSchedules, refreshCareSchedules } = useData();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [showAddTask, setShowAddTask] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  // Convert care schedules to calendar events with recurring dates
  useEffect(() => {
    console.log('🔄 Converting care schedules to calendar events');
    console.log('📅 Care schedules:', careSchedules);
    console.log('🌱 Plants:', plants);
    
    const events: CalendarEvent[] = [];
    const today = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 3); // Show events for next 3 months
    
    careSchedules.forEach(schedule => {
      const plant = plants.find(p => p.id === schedule.plant_id);
      console.log(`🔍 Schedule ${schedule.id} -> Plant:`, plant?.name || 'Unknown');
      
      const careTypes = [
        { value: 'water', icon: Droplets, color: 'bg-blue-500' },
        { value: 'fertilize', icon: Sun, color: 'bg-yellow-500' },
        { value: 'prune', icon: Scissors, color: 'bg-green-500' },
        { value: 'repot', icon: Leaf, color: 'bg-purple-500' },
        { value: 'mist', icon: Droplets, color: 'bg-cyan-500' },
        { value: 'rotate', icon: Thermometer, color: 'bg-orange-500' },
      ];
      
      const careType = careTypes.find(ct => ct.value === schedule.care_type);
      
      if (!schedule.is_active) return;
      
      // Generate recurring events
      let currentDate = new Date(schedule.next_due_date);
      let eventCount = 0;
      const maxEvents = 20; // Limit to prevent too many events
      
      while (currentDate <= endDate && eventCount < maxEvents) {
        // Only add events that are not in the past (or today)
        if (currentDate >= today) {
          events.push({
            id: `${schedule.id}-${eventCount}`,
            plant: plant?.name || 'Unknown Plant',
            type: schedule.care_type,
            date: new Date(currentDate),
            completed: false,
            icon: careType?.icon || Calendar,
            color: careType?.color || 'bg-gray-500',
            priority: 'medium' as const,
            notification: true,
            scheduleId: schedule.id,
            plantId: schedule.plant_id
          });
        }
        
        // Move to next occurrence
        currentDate.setDate(currentDate.getDate() + schedule.frequency_days);
        eventCount++;
      }
    });
    
    console.log('📅 Calendar events created:', events);
    setCalendarEvents(events);
  }, [careSchedules, plants]);

  const todayEvents = calendarEvents.filter(event => 
    event.date.toDateString() === new Date().toDateString()
  );

  const upcomingEvents = calendarEvents.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return eventDate > today && eventDate <= nextWeek;
  });

  const handleTaskComplete = async (eventId: string) => {
    if (!user?.id) return;

    try {
      const event = calendarEvents.find(e => e.id === eventId);
      if (!event) return;

      // Create care log
      await careLogService.createCareLog({
        plant_id: event.plantId,
        care_type: event.type,
        completed_at: new Date().toISOString(),
        notes: 'Completed via calendar'
      });

      // Update the schedule's next due date
      const schedule = careSchedules.find(s => s.id === event.scheduleId);
      if (schedule) {
        const nextDueDate = new Date(event.date);
        nextDueDate.setDate(nextDueDate.getDate() + schedule.frequency_days);
        
        await careScheduleService.updateCareSchedule(event.scheduleId, {
          next_due_date: nextDueDate.toISOString().split('T')[0],
          is_active: true
        });
      }

      await refreshCareSchedules();
      showToast('success', 'Task completed!', 'Great job taking care of your plants!');
    } catch (error) {
      console.error('Error completing task:', error);
      showToast('error', 'Failed to complete task', 'Please try again.');
    }
  };

  const handleAddTask = () => {
    setShowAddTask(true);
  };

  const handleAddTaskSubmit = async (newTask: Omit<CalendarEvent, 'id' | 'completed' | 'scheduleId' | 'plantId'>) => {
    if (!user?.id) return;

    try {
      console.log('➕ Creating new task:', newTask);
      console.log('📅 Selected date:', selectedDate);
      console.log('🌱 Available plants:', plants);
      
      const plant = plants.find(p => p.name === newTask.plant);
      if (!plant) {
        console.error('❌ Plant not found:', newTask.plant);
        showToast('error', 'Plant not found', 'Please select a valid plant.');
        return;
      }

      console.log('✅ Found plant:', plant);

      const scheduleData = {
        plant_id: plant.id,
        care_type: newTask.type,
        frequency_days: 7, // Default frequency
        next_due_date: selectedDate.toISOString().split('T')[0], // Use selectedDate instead of newTask.date
        is_active: true
      };

      console.log('📋 Schedule data to create:', scheduleData);

      const newSchedule = await careScheduleService.createCareSchedule(scheduleData);

      console.log('✅ New schedule created:', newSchedule);

      await refreshCareSchedules();
      showToast('success', 'Task added!', `Added ${newTask.type} task for ${newTask.plant} on ${selectedDate.toLocaleDateString()}`);
    } catch (error) {
      console.error('❌ Error creating task:', error);
      showToast('error', 'Failed to create task', 'Please try again.');
    }
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

  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const isOverdue = (date: Date) => {
    const today = new Date();
    return date < today && date.toDateString() !== today.toDateString();
  };

  const isDueToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const renderCalendarDays = () => {
    const days = [];
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 border border-gray-100 bg-gray-50"></div>);
    }
    
         // Add cells for each day of the month
     for (let day = 1; day <= daysInMonth; day++) {
       const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
       const events = getEventsForDate(date);
       const isToday = date.toDateString() === new Date().toDateString();
       const isSelected = date.toDateString() === selectedDate.toDateString();
       
       days.push(
         <div
           key={day}
           onClick={() => handleDateClick(date)}
           onMouseEnter={(e) => {
             setHoveredDate(date);
             setHoverPosition({ x: e.clientX, y: e.clientY });
           }}
           onMouseLeave={() => setHoveredDate(null)}
           className={`h-24 border border-gray-100 p-2 cursor-pointer transition-all hover:bg-gray-50 ${
             isToday ? 'bg-green-50 border-green-200' : ''
           } ${isSelected ? 'ring-2 ring-green-500' : ''}`}
         >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-medium ${
              isToday ? 'text-green-600' : 'text-gray-900'
            }`}>
              {day}
            </span>
            {events.length > 0 && (
              <span className="text-xs bg-green-100 text-green-800 px-1 rounded-full">
                {events.length}
              </span>
            )}
          </div>
          
                     <div className="flex flex-wrap gap-1 justify-center">
             {events.slice(0, 4).map((event) => {
               const Icon = event.icon;
               const isRecurring = event.id.includes('-'); // Check if it's a recurring event
               return (
                 <div
                   key={event.id}
                   className={`p-1 rounded-full ${event.color} ${
                     event.completed ? 'opacity-50' : ''
                   } ${isOverdue(event.date) && !event.completed ? 'ring-2 ring-red-300' : ''} ${
                     isRecurring ? 'ring-1 ring-white' : ''
                   }`}
                   title={`${event.type} - ${event.plant}${isRecurring ? ' (Recurring)' : ''}`}
                 >
                   <Icon className="w-3 h-3 text-white" />
                 </div>
               );
             })}
             {events.length > 4 && (
               <div className="w-3 h-3 bg-gray-400 rounded-full flex items-center justify-center">
                 <span className="text-xs text-white font-bold">+</span>
               </div>
             )}
           </div>
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plant Calendar</h1>
          <p className="text-gray-600 mt-1">Schedule and track your plant care activities</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleNotificationToggle}
            className={`p-2 rounded-lg transition-colors ${
              notifications 
                ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Bell className="w-5 h-5" />
          </button>
          <button
            onClick={handleAddTask}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                view === 'month' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                view === 'week' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView('day')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                view === 'day' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Day
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {/* Day Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-50 p-3 text-center">
              <span className="text-sm font-medium text-gray-700">{day}</span>
            </div>
          ))}
          
          {/* Calendar Days */}
          {renderCalendarDays()}
        </div>
      </div>

      {/* Hover Popup */}
      {hoveredDate && (
        <div 
          className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm"
          style={{
            left: hoverPosition.x + 10,
            top: hoverPosition.y - 10,
            pointerEvents: 'none'
          }}
        >
          <div className="text-sm font-medium text-gray-900 mb-2">
            {hoveredDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          {getEventsForDate(hoveredDate).length > 0 ? (
            <div className="space-y-2">
              {getEventsForDate(hoveredDate).map((event) => {
                const Icon = event.icon;
                return (
                  <div key={event.id} className="flex items-center space-x-2">
                    <div className={`p-1 rounded ${event.color}`}>
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-gray-700 capitalize">{event.type}</span>
                    <span className="text-sm text-gray-500">- {event.plant}</span>
                    {isOverdue(event.date) && (
                      <span className="text-xs text-red-600 font-medium">(Overdue)</span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No tasks scheduled</p>
          )}
        </div>
      )}

      {/* Today's Tasks */}
      {todayEvents.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Tasks</h3>
          <div className="flex flex-wrap gap-3">
            {todayEvents.map((event) => {
              const Icon = event.icon;
              return (
                <div 
                  key={event.id} 
                  className={`relative p-3 rounded-lg ${event.color} cursor-pointer hover:scale-105 transition-transform ${
                    event.completed ? 'opacity-50' : ''
                  }`}
                  onClick={() => handleTaskComplete(event.id)}
                  title={`${event.type} - ${event.plant}`}
                >
                  <Icon className="w-6 h-6 text-white" />
                  {event.completed && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming Tasks */}
      {upcomingEvents.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h3>
          <div className="space-y-3">
            {upcomingEvents.slice(0, 5).map((event) => {
              const Icon = event.icon;
              return (
                <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${event.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{event.plant}</h4>
                      <p className="text-sm text-gray-600 capitalize">{event.type}</p>
                      <p className="text-xs text-gray-500">
                        {event.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {isOverdue(event.date) && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Overdue
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

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