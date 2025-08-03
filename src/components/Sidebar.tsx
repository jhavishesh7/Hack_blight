import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  PlayCircle, 
  ShoppingBag, 
  MessageCircle, 
  X,
  Leaf,
  BookOpen,
  CheckSquare,
  Camera
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
      id: 'tasks', 
      label: 'Care Tasks', 
      icon: CheckSquare, 
      path: '/tasks',
      description: 'Manage care schedules'
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
      id: 'disease-detection', 
      label: 'Disease Detection', 
      icon: Camera, 
      path: '/disease-detection',
      description: 'AI-powered plant disease detection'
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
        fixed top-0 left-0 h-screen w-72 sm:w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 z-50 shadow-lg overflow-hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto lg:shadow-none
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-green rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-green-900">Navigation</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-green-600 hover:bg-green-50 transition-all duration-200 lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="space-y-1 sm:space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={`
                    w-full group relative overflow-hidden rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-green-600 text-white shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3 p-3 sm:p-3">
                    <div className={`
                      p-2 rounded-lg transition-all duration-200 flex-shrink-0
                      ${isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      }
                    `}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className={`font-medium text-sm sm:text-base truncate ${isActive ? 'text-white' : 'text-gray-900'}`}>
                        {item.label}
                      </p>
                      <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'} truncate`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer - Mobile Only */}
        <div className="lg:hidden p-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              PlantCare Pro v1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;