import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Settings, ArrowRight } from 'lucide-react';
import { Project } from '../types';
import { format } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  onSettingsClick?: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSettingsClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {project.title}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {project.description || 'No description provided'}
            </p>
          </div>
          <button
            onClick={() => onSettingsClick?.(project)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {project.status.replace('-', ' ').toUpperCase()}
          </span>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            {format(new Date(project.createdAt), 'MMM dd, yyyy')}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link
            to={`/projects/${project.id}`}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View Details
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;