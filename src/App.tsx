import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import AuthWrapper from './components/AuthWrapper';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Marketplace from './components/Marketplace';
import LearningVideos from './components/LearningVideos';
import ExpertChat from './components/ExpertChat';
import PlantCalendar from './components/PlantCalendar';
import TaskManagementPage from './components/TaskManagementPage';
import SellForm from './components/SellForm';
import BuyForm from './components/BuyForm';
import DiseaseDetection from './components/DiseaseDetection';
import Diagnosis from './components/Diagnosis';
import LandingPage from './components/LandingPage';
import { ToastProvider } from './contexts/ToastContext';
import { DataProvider } from './contexts/DataContext';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  return (
    <ErrorBoundary>
      <ToastProvider>
        <DataProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/signup" element={<AuthForm />} />
                
                {/* Protected Routes */}
                <Route path="*" element={
                  <AuthWrapper>
                    <div className="flex h-screen bg-gray-50 overflow-hidden">
                      <Sidebar 
                        activeSection={activeSection}
                        setActiveSection={handleSectionChange}
                        isOpen={sidebarOpen}
                        onClose={handleSidebarClose}
                      />
                      <div className="flex-1 flex flex-col min-w-0">
                        <Header onMenuClick={handleMenuClick} sidebarOpen={sidebarOpen} />
                        <main className="flex-1 overflow-auto bg-gray-50">
                          <div className="p-4 sm:p-6">
                            <Routes>
                              <Route path="/dashboard" element={<Dashboard />} />
                              <Route path="/tasks" element={<TaskManagementPage />} />
                              <Route path="/expert-chat" element={<ExpertChat />} />
                              <Route path="/learning-videos" element={<LearningVideos />} />
                              <Route path="/marketplace" element={<Marketplace />} />
                              <Route path="/sell/new" element={<SellForm />} />
                              <Route path="/buy/:listingId" element={<BuyForm />} />
                              <Route path="/plant-calendar" element={<PlantCalendar />} />
                              <Route path="/disease-detection" element={<DiseaseDetection />} />
                              <Route path="/diagnosis" element={<Diagnosis />} />
                              <Route path="*" element={<Dashboard />} />
                            </Routes>
                          </div>
                        </main>
                      </div>
                    </div>
                  </AuthWrapper>
                } />
              </Routes>
            </div>
          </Router>
        </DataProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;