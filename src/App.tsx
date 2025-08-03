import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import AuthWrapper from './components/AuthWrapper';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Marketplace from './components/Marketplace';
import LearningVideos from './components/LearningVideos';
import ExpertChat from './components/ExpertChat';
import PlantCalendar from './components/PlantCalendar';
import WhatsAppBot from './components/WhatsAppBot';
import { ToastProvider } from './contexts/ToastContext';
import './index.css';

function App() {
  console.log('🚀 App component rendered');
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
    <ToastProvider>
      <Router>
        <div className="App min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
          <AuthWrapper>
            <Header onMenuClick={handleMenuClick} sidebarOpen={sidebarOpen} />
            <div className="flex pt-16">
              <Sidebar 
                activeSection={activeSection}
                setActiveSection={handleSectionChange}
                isOpen={sidebarOpen}
                onClose={handleSidebarClose}
              />
              <main className="flex-1 p-6 min-h-screen lg:ml-80">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/expert-chat" element={<ExpertChat />} />
                  <Route path="/learning-videos" element={<LearningVideos />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/plant-calendar" element={<PlantCalendar />} />
                  <Route path="/whatsapp-bot" element={<WhatsAppBot />} />
                </Routes>
              </main>
            </div>
          </AuthWrapper>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;