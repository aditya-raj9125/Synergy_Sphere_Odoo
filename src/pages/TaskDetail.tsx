import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, Edit, Trash2, MessageCircle, Paperclip } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useApp } from '../context/AppContext';
import { mockTasks } from '../data/mockData';
import { Task } from '../types';
import { format } from 'date-fns';

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [task, setTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    status: 'To-Do' as 'To-Do' | 'In Progress' | 'Done',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
  });

  useEffect(() => {
    // Initialize with mock data
    dispatch({ type: 'SET_TASKS', payload: mockTasks });
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      const foundTask = state.tasks.find(t => t.id === id);
      setTask(foundTask || null);
      if (foundTask) {
        setEditData({
          title: foundTask.title,
          description: foundTask.description,
          status: foundTask.status,
          priority: foundTask.priority,
        });
      }
    }
  }, [id, state.tasks]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (task) {
      const updatedTask = {
        ...task,
        ...editData,
        updatedAt: new Date(),
      };
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      setTask(updatedTask);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (task) {
      setEditData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
      });
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (task && window.confirm('Are you sure you want to delete this task?')) {
      dispatch({ type: 'DELETE_TASK', payload: task.id });
      navigate('/my-tasks');
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

  const isOverdue = task && new Date(task.dueDate) < new Date() && task.status !== 'Done';

  if (!task) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar 
          collapsed={state.sidebarCollapsed} 
          onToggle={() => dispatch({ type: 'TOGGLE_SIDEBAR' })} 
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Task not found</h2>
            <p className="text-gray-500 mb-4">The task you're looking for doesn't exist.</p>
            <button onClick={() => navigate('/my-tasks')} className="btn btn-primary">
              Back to My Tasks
            </button>
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
          title="Task Details"
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="flex items-center space-x-4 mb-6">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                      className="text-2xl font-bold text-gray-900 bg-transparent border-b border-gray-300 focus:border-primary-500 focus:outline-none"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
                  )}
                  <p className="text-gray-600 mt-1">
                    In project: <span className="font-medium">{task.project.name}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-2">
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
                        onClick={handleEdit}
                        className="btn btn-outline flex items-center space-x-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={handleDelete}
                        className="btn btn-outline text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Overdue Alert */}
              {isOverdue && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        This task is overdue
                      </h3>
                      <p className="text-sm text-red-700 mt-1">
                        The due date was {format(task.dueDate, 'MMM dd, yyyy')}.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Description */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                    {isEditing ? (
                      <textarea
                        value={editData.description}
                        onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                        rows={6}
                        className="input w-full resize-none"
                        placeholder="Describe the task..."
                      />
                    ) : (
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {task.description || 'No description provided.'}
                      </p>
                    )}
                  </div>

                  {/* Comments Section */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-primary-600">
                            {task.assignee.initials}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-700">
                              Task created and assigned to {task.assignee.name}.
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {format(task.createdAt, 'MMM dd, yyyy at h:mm a')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="input flex-1"
                      />
                      <button className="btn btn-primary flex items-center space-x-2">
                        <MessageCircle className="h-4 w-4" />
                        <span>Comment</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Task Details */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Details</h3>
                    <div className="space-y-4">
                      {/* Status */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        {isEditing ? (
                          <select
                            value={editData.status}
                            onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value as any }))}
                            className="input w-full"
                          >
                            <option value="To-Do">To-Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                          </select>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        )}
                      </div>

                      {/* Priority */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Priority
                        </label>
                        {isEditing ? (
                          <select
                            value={editData.priority}
                            onChange={(e) => setEditData(prev => ({ ...prev, priority: e.target.value as any }))}
                            className="input w-full"
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        )}
                      </div>

                      {/* Assignee */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Assignee
                        </label>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-primary-600">
                              {task.assignee.initials}
                            </span>
                          </div>
                          <span className="text-sm text-gray-900">{task.assignee.name}</span>
                        </div>
                      </div>

                      {/* Due Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Due Date
                        </label>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                            {format(task.dueDate, 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>

                      {/* Tags */}
                      {task.tags.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tags
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {task.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Attachments */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50">
                        <Paperclip className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">No attachments</span>
                      </div>
                    </div>
                    <button className="mt-3 btn btn-outline w-full flex items-center justify-center space-x-2">
                      <Paperclip className="h-4 w-4" />
                      <span>Add Attachment</span>
                    </button>
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
