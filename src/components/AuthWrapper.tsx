import React from 'react';
import { useAuth } from '../hooks/useAuth';
import AuthForm from './AuthForm';
import LoadingSpinner from './LoadingSpinner';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <LoadingSpinner 
        size="lg" 
        text="Loading PlantCare Pro..." 
        fullScreen={true} 
      />
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return <>{children}</>;
};

export default AuthWrapper;