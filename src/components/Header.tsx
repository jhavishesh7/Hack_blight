import React, { useState, useEffect } from 'react';
import { Menu, Bell, User, Search, LogOut, ShoppingCart, Leaf } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { useData } from '../contexts/DataContext';
import NotificationPanel from './NotificationPanel';

interface HeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, sidebarOpen }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { careSchedules, plants, clearData } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const handleSignOut = async () => {
    try {
      console.log('🚪 Starting sign out process...');
      
      // Clear local data first
      clearData();
      console.log('🗑️ Local data cleared');
      
      const { error } = await signOut();
      
      if (error) {
        console.error('❌ Sign out returned error:', error);
        // Don't throw error - just show message and redirect anyway
        showToast('warning', 'Sign out completed', 'You have been signed out locally.');
      } else {
        console.log('✅ Sign out successful');
        showToast('success', 'Signed out successfully', 'Come back soon!');
      }
      
      // Always redirect regardless of server response
      console.log('🔄 Redirecting to signup...');
      setTimeout(() => {
        window.location.href = '/signup';
      }, 1000);
      
    } catch (error) {
      console.error('💥 Sign out error:', error);
      // Even if there's an error, redirect to signup
      showToast('info', 'Redirecting to signup', 'Please create a new account or sign in.');
      setTimeout(() => {
        window.location.href = '/signup';
      }, 1000);
    }
  };

  const handleMarketplaceClick = () => {
    navigate('/marketplace');
  };

  // Calculate notification count based on care schedules
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let count = 0;
    careSchedules.forEach(schedule => {
      if (!schedule.is_active) return;
      
      const dueDate = new Date(schedule.next_due_date);
      
      // Count overdue tasks
      if (dueDate < today && dueDate.toDateString() !== today.toDateString()) {
        count++;
      }
      // Count tasks due today
      else if (dueDate.toDateString() === today.toDateString()) {
        count++;
      }
      // Count tasks due tomorrow
      else if (dueDate.toDateString() === tomorrow.toDateString()) {
        count++;
      }
    });

    setNotificationCount(count);
  }, [careSchedules]);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-3 sm:space-x-6">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl text-green-600 hover:bg-green-50 transition-all duration-200 lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                PlantCare Pro
              </h1>
              <p className="text-xs text-gray-600">Your Green Companion</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-gray-900">PlantCare</h1>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search plants, care tips, products..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Marketplace Button */}
          <button
            onClick={handleMarketplaceClick}
            className="hidden sm:flex items-center space-x-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="font-medium">Marketplace</span>
          </button>
          
          {/* Mobile Marketplace Button */}
          <button
            onClick={handleMarketplaceClick}
            className="sm:hidden p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            aria-label="Marketplace"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
          
          {/* Notifications */}
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </button>
          
          {/* User Menu */}
          <div className="relative group">
            <button className="flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-600 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-600">Plant Enthusiast</p>
              </div>
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {user?.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                    <span>My Orders</span>
                  </button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </header>
  );
};

export default Header;