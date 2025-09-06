import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import { useApp } from '../context/AppContext';
import { useWebSocket } from '../context/WebSocketContext';

const Dashboard: React.FC = () => {
  const { 
    projects, 
    loading, 
    error, 
    fetchProjects, 
    addNotification,
    sidebarCollapsed,
    toggleSidebar
  } = useApp();
  
  const { socket } = useWebSocket();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []); // Remove fetchProjects from dependencies to prevent infinite loop

  // Real-time updates
  useEffect(() => {
    if (socket) {
      // Listen for new projects
      socket.on('project-created', (project) => {
        addNotification({
          title: 'New Project',
          message: `New project "${project.title}" created!`,
          type: 'success',
          read: false,
          createdAt: new Date(),
        });
        fetchProjects(); // Refresh the list
      });

      // Listen for project updates
      socket.on('project-updated', (project) => {
        addNotification({
          title: 'Project Updated',
          message: `Project "${project.title}" was updated`,
          type: 'info',
          read: false,
          createdAt: new Date(),
        });
        fetchProjects(); // Refresh the list
      });

      return () => {
        socket.off('project-created');
        socket.off('project-updated');
      };
    }
  }, [socket, fetchProjects, addNotification]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesPriority = filterPriority === 'All' || project.status === filterPriority;
    
    return matchesSearch && matchesPriority;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleProjectSettings = (project: any) => {
    // Navigate to project edit page
    window.location.href = `/projects/${project.id}/edit`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
          <p className="mt-2 text-sm text-gray-500">If this takes too long, check the browser console for errors</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Error loading projects</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => fetchProjects()}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={toggleSidebar} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuClick={toggleSidebar}
          onSearch={handleSearch}
          title="Projects"
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                  {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-500">
                    Live
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn btn-outline flex items-center"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </button>
                <Link
                  to="/projects/create"
                  className="btn btn-primary flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Link>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="flex flex-wrap gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="input"
                    >
                      <option value="All">All Priorities</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Plus className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery || filterPriority !== 'All' ? 'No projects found' : 'No projects yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || filterPriority !== 'All' 
                    ? 'Try adjusting your search or filters' 
                    : 'Get started by creating your first project'
                  }
                </p>
                {!searchQuery && filterPriority === 'All' && (
                  <Link
                    to="/projects/create"
                    className="btn btn-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onSettingsClick={() => handleProjectSettings(project)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;