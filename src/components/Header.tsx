import React from 'react';
import { Menu, Bell, User, Search, LogOut, ShoppingCart, Leaf } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

interface HeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, sidebarOpen }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      showToast('success', 'Signed out successfully', 'Come back soon!');
      navigate('/');
    } catch (error) {
      showToast('error', 'Sign out failed', 'Please try again.');
    }
  };

  const handleMarketplaceClick = () => {
    navigate('/marketplace');
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-green-200 fixed w-full top-0 z-40 shadow-green">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl text-green-600 hover:bg-green-50 transition-all duration-200 lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-green rounded-xl flex items-center justify-center shadow-green">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                PlantCare Pro
              </h1>
              <p className="text-xs text-green-600">Your Green Companion</p>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400" />
            <input
              type="text"
              placeholder="Search plants, care tips, products..."
              className="w-full pl-12 pr-4 py-3 bg-green-50 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Marketplace Button */}
          <button
            onClick={handleMarketplaceClick}
            className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-green text-white rounded-xl hover:shadow-green-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="font-medium">Marketplace</span>
          </button>
          
          {/* Notifications */}
          <button className="relative p-3 text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
              3
            </span>
          </button>
          
          {/* User Menu */}
          <div className="relative group">
            <button className="flex items-center space-x-3 p-2 rounded-xl hover:bg-green-50 transition-all duration-200">
              <div className="w-8 h-8 bg-gradient-green rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-green-900">
                  {user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-green-600">Plant Enthusiast</p>
              </div>
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-green-lg border border-green-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-green-100">
                  <div className="w-10 h-10 bg-gradient-green rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900">
                      {user?.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-sm text-green-600">{user?.email}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-green-700 hover:bg-green-50 rounded-lg transition-colors">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-green-700 hover:bg-green-50 rounded-lg transition-colors">
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-green-700 hover:bg-green-50 rounded-lg transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                    <span>My Orders</span>
                  </button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-green-100">
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
    </header>
  );
};

export default Header;