import React from 'react';
import { Leaf, Plus, Search } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  variant?: 'default' | 'search' | 'add';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Leaf,
  title,
  description,
  actionText,
  onAction,
  variant = 'default'
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'search':
        return Search;
      case 'add':
        return Plus;
      default:
        return Icon;
    }
  };

  const IconComponent = getIcon();

  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <IconComponent className="w-8 h-8 text-emerald-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState; 