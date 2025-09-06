import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Settings, CheckCircle, Circle, Clock } from 'lucide-react';
import { Task } from '../types';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onSettingsClick?: (task: Task) => void;
  onStatusChange?: (taskId: string, newStatus: string) => void;
  onToggleComplete?: (taskId: string, completed: boolean) => void;
  showProject?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = memo(({ 
  task, 
  onSettingsClick, 
  onStatusChange, 
  onToggleComplete, 
  showProject = false 
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
  const isCompleted = task.status === 'completed';

  const handleStatusToggle = () => {
    if (onToggleComplete) {
      onToggleComplete(task.id, !isCompleted);
    } else if (onStatusChange) {
      onStatusChange(task.id, isCompleted ? 'todo' : 'completed');
    }
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSettingsClick) {
      onSettingsClick(task);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {task.title}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {task.description || 'No description provided'}
            </p>
          </div>
          <button
            onClick={handleSettingsClick}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            title="Task settings"
          >
            <Settings className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {showProject && task.project && (
          <div className="mb-3">
            <span className="text-sm text-gray-500">Project: </span>
            <span className="text-sm font-medium text-gray-700">
              {task.project.title}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.status.replace('-', ' ').toUpperCase()}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority.toUpperCase()}
            </span>
          </div>
          <button
            onClick={handleStatusToggle}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {getStatusIcon(task.status)}
          </button>
        </div>

        {task.dueDate && (
          <div className={`flex items-center text-sm mb-3 ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
            <Calendar className="h-4 w-4 mr-1" />
            {format(new Date(task.dueDate), 'MMM dd, yyyy')}
            {isOverdue && <span className="ml-2 text-xs font-medium">OVERDUE</span>}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <div className="h-6 w-6 bg-primary-100 rounded-full flex items-center justify-center mr-2">
              <span className="text-xs font-medium text-primary-600">
                {task.assignee?.initials || 'U'}
              </span>
            </div>
            <span>{task.assignee?.name || 'Unassigned'}</span>
          </div>
          <Link
            to={`/tasks/${task.id}`}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';

export default TaskCard;