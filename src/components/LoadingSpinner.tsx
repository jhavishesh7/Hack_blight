import React from 'react';
import { Leaf } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...',
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex items-center justify-center';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className="relative inline-block">
          <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-green-200 border-t-green-600`} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Leaf className={`${size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-4 h-4' : 'w-3 h-3'} text-green-600 animate-pulse`} />
          </div>
        </div>
        {text && (
          <p className="text-green-600 mt-3 font-medium">{text}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner; 