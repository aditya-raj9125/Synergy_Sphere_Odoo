import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Settings, Paperclip, CheckCircle, Circle, Clock } from 'lucide-react';
import { Task } from '../types';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onSettingsClick?: (task: Task) => void;
  showProject?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onSettingsClick, showProject = false }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Done':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done';

  return (
    <div className="card-elevated p-3 sm:p-4 relative group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          {getStatusIcon(task.status)}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {task.title}
            </h3>
            {showProject && (
              <p className="text-xs text-gray-500 mb-2">
                {task.project.name}
              </p>
            )}
            <p className="text-sm text-gray-600 line-clamp-2">
              {task.description}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={() => onSettingsClick?.(task)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <Settings className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Status and Priority */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}
        >
          {task.status}
        </span>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}
        >
          {task.priority}
        </span>
      </div>

      {/* Due Date and Assignee */}
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
            {format(task.dueDate, 'MMM dd')}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-primary-600">
              {task.assignee.initials}
            </span>
          </div>
          <button className="p-1 rounded-md hover:bg-gray-100">
            <Paperclip className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Click overlay for navigation */}
      <Link
        to={`/tasks/${task.id}`}
        className="absolute inset-0"
        aria-label={`View ${task.title} task`}
      />
    </div>
  );
};

export default TaskCard;
