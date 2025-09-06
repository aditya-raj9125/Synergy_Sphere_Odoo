import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Search } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { mockProjects } from '../data/mockData';
import { Project } from '../types';

const Dashboard: React.FC = () => {
  const { state, dispatch } = useApp();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Initialize with mock data
    dispatch({ type: 'SET_PROJECTS', payload: mockProjects });
  }, [dispatch]);

  const filteredProjects = state.projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesPriority = filterPriority === 'All' || project.priority === filterPriority;
    
    return matchesSearch && matchesPriority;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleProjectSettings = (project: Project) => {
    // Navigate to project edit page
    window.location.href = `/projects/${project.id}/edit`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        collapsed={state.sidebarCollapsed} 
        onToggle={() => dispatch({ type: 'TOGGLE_SIDEBAR' })} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
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
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="btn btn-outline flex items-center space-x-2"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </button>
                  
                  {showFilters && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                      <div className="p-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Priority
                        </label>
                        <select
                          value={filterPriority}
                          onChange={(e) => setFilterPriority(e.target.value)}
                          className="input w-full"
                        >
                          <option value="All">All Priorities</option>
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
                
                <Link
                  to="/projects/create"
                  className="btn btn-primary flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Project</span>
                </Link>
              </div>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Plus className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {searchQuery ? 'No projects found' : 'No projects yet'}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {searchQuery 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Get started by creating your first project'
                  }
                </p>
                {!searchQuery && (
                  <Link
                    to="/projects/create"
                    className="btn btn-primary"
                  >
                    Create Project
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="relative animate-fade-in">
                    <ProjectCard
                      project={project}
                      onSettingsClick={handleProjectSettings}
                    />
                  </div>
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
