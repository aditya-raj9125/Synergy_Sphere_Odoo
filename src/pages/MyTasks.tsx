import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, CheckCircle, Clock, Circle } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { mockTasks } from '../data/mockData';
import { Task } from '../types';

const MyTasks: React.FC = () => {
  const { state, dispatch } = useApp();
  const { user } = useAuth();
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Initialize with mock data
    dispatch({ type: 'SET_TASKS', payload: mockTasks });
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const tasks = state.tasks.filter(task => task.assignee.id === user.id);
      setMyTasks(tasks);
    }
  }, [user, state.tasks]);

  const filteredTasks = myTasks.filter(task => {
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const getStatusCounts = () => {
    const counts = { 'To-Do': 0, 'In Progress': 0, 'Done': 0 };
    myTasks.forEach(task => {
      counts[task.status as keyof typeof counts]++;
    });
    return counts;
  };

  const getPriorityCounts = () => {
    const counts = { 'High': 0, 'Medium': 0, 'Low': 0 };
    myTasks.forEach(task => {
      counts[task.priority as keyof typeof counts]++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();
  const priorityCounts = getPriorityCounts();

  const overdueTasks = myTasks.filter(task => 
    new Date(task.dueDate) < new Date() && task.status !== 'Done'
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        collapsed={state.sidebarCollapsed} 
        onToggle={() => dispatch({ type: 'TOGGLE_SIDEBAR' })} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
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
                {overdueTasks.length > 0 && (
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm">
                    {overdueTasks.length} overdue
                  </span>
                )}
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
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                      <div className="p-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                          </label>
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="input w-full"
                          >
                            <option value="All">All Status</option>
                            <option value="To-Do">To-Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Priority
                          </label>
                          <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="input w-full"
                          >
                            <option value="All">All Priorities</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <Link
                  to="/tasks/create"
                  className="btn btn-primary flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Task</span>
                </Link>
              </div>
            </div>

            {/* Task Stats */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <Circle className="h-5 w-5 text-gray-400" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-500">To-Do</p>
                    <p className="text-lg font-semibold text-gray-900">{statusCounts['To-Do']}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-500">In Progress</p>
                    <p className="text-lg font-semibold text-gray-900">{statusCounts['In Progress']}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-500">Done</p>
                    <p className="text-lg font-semibold text-gray-900">{statusCounts['Done']}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-500">High Priority</p>
                    <p className="text-lg font-semibold text-gray-900">{priorityCounts['High']}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-500">Medium</p>
                    <p className="text-lg font-semibold text-gray-900">{priorityCounts['Medium']}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-500">Low</p>
                    <p className="text-lg font-semibold text-gray-900">{priorityCounts['Low']}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Overdue Tasks Alert */}
            {overdueTasks.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {overdueTasks.length} overdue task{overdueTasks.length !== 1 ? 's' : ''}
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      You have {overdueTasks.length} task{overdueTasks.length !== 1 ? 's' : ''} that are past their due date.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tasks Grid */}
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {statusFilter === 'All' && priorityFilter === 'All' ? 'No tasks assigned' : 'No tasks found'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {statusFilter === 'All' && priorityFilter === 'All' 
                    ? 'You don\'t have any tasks assigned to you yet'
                    : 'Try adjusting your filter criteria'
                  }
                </p>
                {statusFilter === 'All' && priorityFilter === 'All' && (
                  <Link
                    to="/tasks/create"
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
                      showProject={true}
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

export default MyTasks;
