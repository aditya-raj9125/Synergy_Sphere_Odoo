import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, ArrowLeft, Calendar, Users, Settings, Paperclip } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import { useApp } from '../context/AppContext';
import { mockProjects, mockTasks } from '../data/mockData';
import { Project, Task } from '../types';
import { format } from 'date-fns';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useApp();
  const [project, setProject] = useState<Project | null>(null);
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    // Initialize with mock data
    dispatch({ type: 'SET_PROJECTS', payload: mockProjects });
    dispatch({ type: 'SET_TASKS', payload: mockTasks });
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      const foundProject = state.projects.find(p => p.id === id);
      setProject(foundProject || null);
      
      const tasks = state.tasks.filter(t => t.project.id === id);
      setProjectTasks(tasks);
    }
  }, [id, state.projects, state.tasks]);

  const filteredTasks = projectTasks.filter(task => 
    statusFilter === 'All' || task.status === statusFilter
  );

  const getStatusCounts = () => {
    const counts = { 'To-Do': 0, 'In Progress': 0, 'Done': 0 };
    projectTasks.forEach(task => {
      counts[task.status as keyof typeof counts]++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (!project) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar 
          collapsed={state.sidebarCollapsed} 
          onToggle={() => dispatch({ type: 'TOGGLE_SIDEBAR' })} 
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h2>
            <p className="text-gray-500 mb-4">The project you're looking for doesn't exist.</p>
            <Link to="/dashboard" className="btn btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        collapsed={state.sidebarCollapsed} 
        onToggle={() => dispatch({ type: 'TOGGLE_SIDEBAR' })} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          title={`Projects / ${project.name}`}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            {/* Project Header */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <Link
                  to="/dashboard"
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                  <p className="text-gray-600 mt-1">{project.description}</p>
                </div>
                <Link
                  to={`/projects/${project.id}/edit`}
                  className="btn btn-outline flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Edit Project</span>
                </Link>
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Deadline</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {format(project.deadline, 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Team Members</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {project.members.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Paperclip className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Tasks</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {projectTasks.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <div className="w-5 h-5 bg-purple-600 rounded-full"></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Progress</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {project.progress}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
                <div className="flex space-x-2">
                  {['All', 'To-Do', 'In Progress', 'Done'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusFilter === status
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {status} {status !== 'All' && `(${statusCounts[status as keyof typeof statusCounts]})`}
                    </button>
                  ))}
                </div>
              </div>
              
              <Link
                to={`/tasks/create?project=${project.id}`}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Task</span>
              </Link>
            </div>

            {/* Tasks Grid */}
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {statusFilter === 'All' ? 'No tasks yet' : `No ${statusFilter.toLowerCase()} tasks`}
                </h3>
                <p className="text-gray-500 mb-6">
                  {statusFilter === 'All' 
                    ? 'Get started by creating your first task'
                    : `No tasks with status "${statusFilter}"`
                  }
                </p>
                {statusFilter === 'All' && (
                  <Link
                    to={`/tasks/create?project=${project.id}`}
                    className="btn btn-primary"
                  >
                    Create Task
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="relative">
                    <TaskCard
                      task={task}
                      showProject={false}
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

export default ProjectDetail;
