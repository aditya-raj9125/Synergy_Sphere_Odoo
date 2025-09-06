import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, ArrowLeft, Settings } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import { useApp } from '../context/AppContext';
import { useWebSocket } from '../context/WebSocketContext';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    projects, 
    tasks, 
    loading, 
    error, 
    fetchProjects, 
    fetchTasks, 
    addNotification,
    sidebarCollapsed,
    toggleSidebar
  } = useApp();
  
  const { socket, joinProjectRoom, leaveProjectRoom } = useWebSocket();
  
  const [project, setProject] = useState<any>(null);
  const [projectTasks, setProjectTasks] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    if (id) {
      // Only show loading for the first fetch, subsequent fetches should be silent
      const hasProjects = projects.length > 0;
      const hasTasks = tasks.length > 0;
      
      if (!hasProjects) {
        fetchProjects();
      }
      if (!hasTasks) {
        fetchTasks();
      }
      joinProjectRoom(id);
    }
    
    return () => {
      if (id) {
        leaveProjectRoom(id);
      }
    };
  }, [id, fetchProjects, fetchTasks, joinProjectRoom, leaveProjectRoom, projects.length, tasks.length]);

  // Real-time updates
  useEffect(() => {
    if (socket && id) {
      // Listen for project updates
      socket.on('project-updated', (updatedProject) => {
        if (updatedProject.id === id) {
          addNotification({
            title: 'Project Updated',
            message: `Project "${updatedProject.title}" was updated`,
            type: 'info',
            read: false,
            createdAt: new Date(),
          });
          fetchProjects(); // Refresh the project
        }
      });

      // Listen for new tasks in this project
      socket.on('task-created', (task) => {
        if (task.projectId === id) {
          addNotification({
            title: 'New Task',
            message: `New task "${task.title}" added to project`,
            type: 'success',
            read: false,
            createdAt: new Date(),
          });
          fetchTasks(); // Refresh the tasks
        }
      });

      // Listen for task updates in this project
      socket.on('task-updated', (task) => {
        if (task.projectId === id) {
          addNotification({
            title: 'Task Updated',
            message: `Task "${task.title}" was updated`,
            type: 'info',
            read: false,
            createdAt: new Date(),
          });
          fetchTasks(); // Refresh the tasks
        }
      });

      return () => {
        socket.off('project-updated');
        socket.off('task-created');
        socket.off('task-updated');
      };
    }
  }, [socket, id, fetchProjects, fetchTasks, addNotification]);

  useEffect(() => {
    if (id && projects.length > 0) {
      const foundProject = projects.find(p => p.id === id);
      setProject(foundProject || null);
    }
  }, [id, projects]);

  useEffect(() => {
    if (id && tasks.length > 0) {
      const projectTasks = tasks.filter(t => t.projectId === id);
      setProjectTasks(projectTasks);
    }
  }, [id, tasks]);

  const filteredTasks = projectTasks.filter(task => {
    return statusFilter === 'All' || task.status === statusFilter;
  });

  const getStatusCount = (status: string) => {
    return projectTasks.filter(task => task.status === status).length;
  };

  const getPriorityCount = (priority: string) => {
    return projectTasks.filter(task => task.priority === priority).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">
            {error || 'Project not found'}
          </div>
          <p className="text-gray-600 mb-4">
            {error ? 'Failed to load project' : 'The project you are looking for does not exist'}
          </p>
          <Link to="/dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
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
          title={project.title}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Link
                    to="/dashboard"
                    className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                  </Link>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                    <p className="text-gray-600">{project.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Link
                    to={`/projects/${project.id}/edit`}
                    className="btn btn-outline flex items-center"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                  <Link
                    to={`/tasks/create?project=${project.id}`}
                    className="btn btn-primary flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Link>
                </div>
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">T</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                      <p className="text-2xl font-bold text-gray-900">{projectTasks.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold text-sm">✓</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-gray-900">{getStatusCount('completed')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 font-bold text-sm">!</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">High Priority</p>
                      <p className="text-2xl font-bold text-gray-900">{getPriorityCount('high')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-sm">%</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Progress</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {projectTasks.length > 0 
                          ? Math.round((getStatusCount('completed') / projectTasks.length) * 100)
                          : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tasks Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
                    <div className="flex items-center space-x-2">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input text-sm"
                      >
                        <option value="All">All Status</option>
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-4">
                        <Plus className="h-12 w-12 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {statusFilter === 'All' ? 'No tasks yet' : 'No tasks found'}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {statusFilter === 'All' 
                          ? 'Get started by adding your first task to this project'
                          : 'Try adjusting your filter to see more tasks'
                        }
                      </p>
                      {statusFilter === 'All' && (
                        <Link
                          to={`/tasks/create?project=${project.id}`}
                          className="btn btn-primary"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Task
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onStatusChange={(taskId, newStatus) => {
                            // Handle status change
                            console.log('Status change:', taskId, newStatus);
                          }}
                          showProject={false}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectDetail;