import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, CheckCircle, Clock, Circle, Edit, Trash2, X } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';

const MyTasks: React.FC = () => {
  const { 
    tasks, 
    loading, 
    error, 
    fetchTasks, 
    updateTask,
    addNotification,
    sidebarCollapsed,
    toggleSidebar
  } = useApp();
  const { user } = useAuth();
  const { socket } = useWebSocket();
  
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showTaskMenu, setShowTaskMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  

  // Memoize user tasks to prevent unnecessary re-renders
  const myTasks = useMemo(() => {
    if (!user || !tasks) return [];
    return tasks.filter(task => task.assigneeId === user.id);
  }, [user, tasks]);

  // Memoize filtered tasks to prevent unnecessary filtering
  const filteredTasks = useMemo(() => {
    return myTasks.filter(task => {
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
      return matchesStatus && matchesPriority;
    });
  }, [myTasks, statusFilter, priorityFilter]);

  // Memoize status counts
  const statusCounts = useMemo(() => ({
    todo: myTasks.filter(task => task.status === 'todo').length,
    'in-progress': myTasks.filter(task => task.status === 'in-progress').length,
    completed: myTasks.filter(task => task.status === 'completed').length,
  }), [myTasks]);

  // Memoize priority counts
  const priorityCounts = useMemo(() => ({
    high: myTasks.filter(task => task.priority === 'high').length,
    medium: myTasks.filter(task => task.priority === 'medium').length,
    low: myTasks.filter(task => task.priority === 'low').length,
  }), [myTasks]);

  // Optimize fetchTasks to only run once
  useEffect(() => {
    if (user) {
      const hasTasks = tasks.length > 0;
      if (!hasTasks) {
        fetchTasks();
      }
    }
  }, [user, tasks.length, fetchTasks]); // Only fetch if no tasks exist

  // Optimize real-time updates with useCallback
  const handleTaskCreated = useCallback((task: any) => {
    if (task.assigneeId === user?.id) {
      addNotification({
        title: 'New Task',
        message: `New task "${task.title}" assigned to you!`,
        type: 'success',
        read: false,
        createdAt: new Date(),
      });
      fetchTasks(); // Refresh the list
    }
  }, [user, addNotification, fetchTasks]);

  const handleTaskUpdated = useCallback((task: any) => {
    if (task.assigneeId === user?.id) {
      addNotification({
        title: 'Task Updated',
        message: `Task "${task.title}" was updated`,
        type: 'info',
        read: false,
        createdAt: new Date(),
      });
      fetchTasks(); // Refresh the list
    }
  }, [user, addNotification, fetchTasks]);

  // Real-time updates
  useEffect(() => {
    if (socket && user) {
      socket.on('task-created', handleTaskCreated);
      socket.on('task-updated', handleTaskUpdated);

      return () => {
        socket.off('task-created', handleTaskCreated);
        socket.off('task-updated', handleTaskUpdated);
      };
    }
  }, [socket, user, handleTaskCreated, handleTaskUpdated]);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        await updateTask(taskId, { ...task, status: newStatus as 'todo' | 'in-progress' | 'completed' });
        addNotification({
          title: 'Task Updated',
          message: `Task status changed to ${newStatus}`,
          type: 'success',
          read: false,
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      addNotification({
        title: 'Error',
        message: 'Failed to update task status',
        type: 'error',
        read: false,
        createdAt: new Date(),
      });
    }
  };

  const handleTaskSettings = (task: any) => {
    setSelectedTask(task);
    setShowTaskMenu(true);
  };

  const handleEditTask = () => {
    if (selectedTask) {
      // Navigate to edit task page
      window.location.href = `/tasks/${selectedTask.id}/edit`;
    }
    setShowTaskMenu(false);
  };

  const handleDeleteTask = async () => {
    if (selectedTask && window.confirm('Are you sure you want to delete this task?')) {
      try {
        // Add delete functionality here
        addNotification({
          title: 'Task Deleted',
          message: 'Task deleted successfully',
          type: 'success',
          read: false,
          createdAt: new Date(),
        });
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
        addNotification({
          title: 'Error',
          message: 'Failed to delete task',
          type: 'error',
          read: false,
          createdAt: new Date(),
        });
      }
    }
    setShowTaskMenu(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowTaskMenu(false);
      }
    };

    if (showTaskMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTaskMenu]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Error loading tasks</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => fetchTasks()}
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
          title="My Tasks"
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                  {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
                </span>
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
                  to="/tasks/create"
                  className="btn btn-primary flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Link>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <Circle className="h-8 w-8 text-gray-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">To Do</p>
                    <p className="text-2xl font-bold text-gray-900">{statusCounts.todo}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-blue-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900">{statusCounts['in-progress']}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{statusCounts.completed}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{priorityCounts.high}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="input"
                    >
                      <option value="All">All Status</option>
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="input"
                    >
                      <option value="All">All Priorities</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Tasks List */}
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Plus className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {statusFilter !== 'All' || priorityFilter !== 'All' ? 'No tasks found' : 'No tasks yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {statusFilter !== 'All' || priorityFilter !== 'All' 
                    ? 'Try adjusting your filters' 
                    : 'Get started by creating your first task'
                  }
                </p>
                {statusFilter === 'All' && priorityFilter === 'All' && (
                  <Link
                    to="/tasks/create"
                    className="btn btn-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onSettingsClick={handleTaskSettings}
                    showProject={true}
                  />
                ))}
                
                {/* Empty State */}
                {filteredTasks.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <Circle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                    <p className="text-gray-500 mb-4">
                      {statusFilter !== 'All' || priorityFilter !== 'All' 
                        ? 'Try adjusting your filters to see more tasks.'
                        : 'You don\'t have any tasks assigned to you yet.'
                      }
                    </p>
                    <Link
                      to="/tasks/create"
                      className="btn btn-primary"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Task
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Task Menu Modal */}
      {showTaskMenu && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div ref={menuRef} className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Task Options</h3>
                <button
                  onClick={() => setShowTaskMenu(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={handleEditTask}
                  className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit className="h-5 w-5 mr-3" />
                  Edit Task
                </button>
                
                <button
                  onClick={handleDeleteTask}
                  className="w-full flex items-center px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-5 w-5 mr-3" />
                  Delete Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;