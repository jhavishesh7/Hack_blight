import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  PlayCircle, 
  ShoppingBag, 
  MessageCircle, 
  Bot,
  X,
  Leaf,
  TrendingUp,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  setActiveSection, 
  isOpen, 
  onClose 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Home, 
      path: '/dashboard',
      description: 'Overview of your plants'
    },
    { 
      id: 'calendar', 
      label: 'Plant Calendar', 
      icon: Calendar, 
      path: '/plant-calendar',
      description: 'Care schedule & reminders'
    },
    { 
      id: 'learning', 
      label: 'Learning Center', 
      icon: BookOpen, 
      path: '/learning-videos',
      description: 'Educational videos & tips'
    },
    { 
      id: 'marketplace', 
      label: 'Marketplace', 
      icon: ShoppingBag, 
      path: '/marketplace',
      description: 'Plants, tools & supplies'
    },
    { 
      id: 'chat', 
      label: 'AI Assistant', 
      icon: MessageCircle, 
      path: '/expert-chat',
      description: 'Get plant care advice'
    },
    { 
      id: 'whatsapp', 
      label: 'WhatsApp Bot', 
      icon: Bot, 
      path: '/whatsapp-bot',
      description: 'Automated care reminders'
    },
  ];

  const handleNavigation = (item: typeof menuItems[0]) => {
    setActiveSection(item.id);
    navigate(item.path);
    onClose();
  };

  // Update active section based on current location
  React.useEffect(() => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    if (currentItem) {
      setActiveSection(currentItem.id);
    }
  }, [location.pathname, setActiveSection]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-80 bg-white/90 backdrop-blur-md border-r border-green-200 transform transition-transform duration-300 z-50 shadow-green-lg
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto lg:shadow-none
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-green-100 mt-16 lg:mt-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-green rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-green-900">Navigation</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-green-600 hover:bg-green-50 transition-all duration-200 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-6">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={`
                    w-full group relative overflow-hidden rounded-2xl transition-all duration-300
                    ${isActive 
                      ? 'bg-gradient-green text-white shadow-green-lg transform scale-105' 
                      : 'text-green-700 hover:bg-green-50 hover:shadow-green'
                    }
                  `}
                >
                  <div className="flex items-center space-x-4 p-4">
                    <div className={`
                      p-3 rounded-xl transition-all duration-300
                      ${isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-green-100 text-green-600 group-hover:bg-green-200'
                      }
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`font-semibold ${isActive ? 'text-white' : 'text-green-900'}`}>
                        {item.label}
                      </p>
                      <p className={`text-sm ${isActive ? 'text-white/80' : 'text-green-600'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-green-100">
          <div className="bg-gradient-green-soft rounded-2xl p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-green-900">Plant Growth</p>
                <p className="text-sm text-green-700">Track your progress</p>
              </div>
            </div>
            <div className="w-full bg-white/50 rounded-full h-2">
              <div className="bg-white h-2 rounded-full" style={{ width: '75%' }} />
            </div>
            <p className="text-xs text-green-700 mt-2">75% of plants thriving</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;