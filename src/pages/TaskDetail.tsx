import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Edit, Trash2, MessageCircle, Paperclip } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    tasks, 
    loading, 
    error, 
    fetchTasks, 
    fetchTask,
    updateTask, 
    deleteTask, 
    addNotification,
    sidebarCollapsed,
    toggleSidebar
  } = useApp();
  
  const [task, setTask] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    status: 'todo' as 'todo' | 'in-progress' | 'completed',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  useEffect(() => {
    const loadTask = async () => {
      if (id) {
        console.log('Loading task with ID:', id);
        
        // First try to find in existing tasks
        if (tasks.length > 0) {
          const foundTask = tasks.find(t => t.id === id);
          if (foundTask) {
            console.log('Found task in existing tasks:', foundTask);
            setTask(foundTask);
            setEditData({
              title: foundTask.title || '',
              description: foundTask.description || '',
              status: foundTask.status || 'todo',
              priority: foundTask.priority || 'medium',
            });
            return;
          }
        }
        
        // If not found, fetch from API
        console.log('Task not found in existing tasks, fetching from API...');
        const fetchedTask = await fetchTask(id);
        if (fetchedTask) {
          console.log('Fetched task from API:', fetchedTask);
          setTask(fetchedTask);
          setEditData({
            title: fetchedTask.title || '',
            description: fetchedTask.description || '',
            status: fetchedTask.status || 'todo',
            priority: fetchedTask.priority || 'medium',
          });
        }
      }
    };
    
    loadTask();
  }, [id, fetchTask]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (task) {
      setEditData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
      });
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!task) return;

    try {
      const updatedTask = await updateTask(task.id, editData);
      if (updatedTask) {
        setTask(updatedTask);
        setIsEditing(false);
        addNotification({
          title: 'Task Updated',
          message: 'Task updated successfully!',
          type: 'success',
          read: false,
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Error updating task:', error);
      addNotification({
        title: 'Error',
        message: 'Failed to update task. Please try again.',
        type: 'error',
        read: false,
        createdAt: new Date(),
      });
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const success = await deleteTask(task.id);
        if (success) {
          addNotification({
            title: 'Task Deleted',
            message: 'Task deleted successfully!',
            type: 'success',
            read: false,
            createdAt: new Date(),
          });
          navigate('/mytasks');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        addNotification({
          title: 'Error',
          message: 'Failed to delete task. Please try again.',
          type: 'error',
          read: false,
          createdAt: new Date(),
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading task...</p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">
            {error || 'Task not found'}
          </div>
          <p className="text-gray-600 mb-4">
            {error ? 'Failed to load task' : 'The task you are looking for does not exist'}
          </p>
          <button 
            onClick={() => navigate('/mytasks')}
            className="btn btn-primary"
          >
            Back to My Tasks
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
          title="Task Details"
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <button
                    onClick={() => navigate('/mytasks')}
                    className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {isEditing ? (
                        <input
                          type="text"
                          name="title"
                          value={editData.title}
                          onChange={handleInputChange}
                          className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-primary-500 focus:outline-none"
                        />
                      ) : (
                        task.title
                      )}
                    </h1>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace('-', ' ').toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleCancel}
                        className="btn btn-outline"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="btn btn-primary"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleDelete}
                        className="btn btn-outline text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </button>
                      <button
                        onClick={handleEdit}
                        className="btn btn-primary"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Task Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Description */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
                    {isEditing ? (
                      <textarea
                        name="description"
                        value={editData.description}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter task description..."
                      />
                    ) : (
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {task.description || 'No description provided'}
                      </p>
                    )}
                  </div>

                  {/* Comments Section */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Comments</h2>
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No comments yet</p>
                      <p className="text-sm text-gray-500">Comments will appear here when added</p>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Task Info */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Info</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        {isEditing ? (
                          <select
                            name="status"
                            value={editData.status}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          >
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status.replace('-', ' ').toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        {isEditing ? (
                          <select
                            name="priority"
                            value={editData.priority}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority.toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : 'No due date'}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {format(new Date(task.createdAt), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attachments */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h2>
                    <div className="text-center py-4">
                      <Paperclip className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 text-sm">No attachments</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskDetail;