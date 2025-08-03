import React from 'react';
import { useAuth } from '../hooks/useAuth';
import AuthForm from './AuthForm';
import LoadingSpinner from './LoadingSpinner';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  console.log('🔧 AuthWrapper component rendered');
  const { user, loading } = useAuth();
  
  console.log('📊 AuthWrapper state:', { user: user?.email || 'null', loading });

  if (loading) {
    console.log('⏳ AuthWrapper: Showing loading spinner');
    return (
      <LoadingSpinner 
        size="lg" 
        text="Loading PlantCare Pro..." 
        fullScreen={true} 
      />
    );
  }

  if (!user) {
    console.log('🔐 AuthWrapper: No user, showing AuthForm');
    return <AuthForm />;
  }

  console.log('✅ AuthWrapper: User authenticated, rendering children');
  return <>{children}</>;
};

export default AuthWrapper;