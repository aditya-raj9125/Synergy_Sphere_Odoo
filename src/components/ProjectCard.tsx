import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Settings, Paperclip, MoreHorizontal } from 'lucide-react';
import { Project } from '../types';
import { format } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  onSettingsClick?: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSettingsClick }) => {
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

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="card-elevated p-4 sm:p-6 relative group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {project.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {project.description}
          </p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onSettingsClick?.(project)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <Settings className="h-4 w-4 text-gray-500" />
          </button>
          <button className="p-1 rounded-md hover:bg-gray-100">
            <MoreHorizontal className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
          >
            {tag}
          </span>
        ))}
        {project.tags.length > 3 && (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
            +{project.tags.length - 3}
          </span>
        )}
      </div>

      {/* Priority */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(project.priority)}`}
        >
          {project.priority} Priority
        </span>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          {format(project.deadline, 'MMM dd')}
        </div>
      </div>

      {/* Team Members */}
      <div className="flex items-center justify-between">
        <div className="flex items-center -space-x-2">
          {project.members.slice(0, 3).map((member) => (
            <div
              key={member.id}
              className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center border-2 border-white"
              title={member.name}
            >
              <span className="text-xs font-medium text-primary-600">
                {member.initials}
              </span>
            </div>
          ))}
          {project.members.length > 3 && (
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white">
              <span className="text-xs font-medium text-gray-600">
                +{project.members.length - 3}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1 rounded-md hover:bg-gray-100">
            <Paperclip className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Click overlay for navigation */}
      <Link
        to={`/projects/${project.id}`}
        className="absolute inset-0"
        aria-label={`View ${project.name} project`}
      />
    </div>
  );
};

export default ProjectCard;
