import React from 'react';
import TaskManagement from './TaskManagement';
import { useToast } from '../contexts/ToastContext';

const TaskManagementPage: React.FC = () => {
  const { showToast } = useToast();

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Care Tasks</h1>
        <p className="text-gray-600 mt-2">Schedule and manage care tasks for your plants</p>
      </div>
      
      <TaskManagement 
        onTaskAdded={(task) => {
          showToast('success', 'Task created', 'Your care task has been scheduled successfully!');
        }}
        onTaskCompleted={(taskId) => {
          showToast('success', 'Task completed', 'Great job! Task marked as completed.');
        }}
        onTaskDeleted={(taskId) => {
          showToast('success', 'Task deleted', 'Task has been removed from your schedule.');
        }}
      />
    </div>
  );
};

export default TaskManagementPage; 