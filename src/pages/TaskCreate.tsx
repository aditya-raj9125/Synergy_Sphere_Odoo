import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const TaskCreate: React.FC = () => {
  const { taskId } = useParams<{ taskId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { 
    projects, 
    tasks, 
    createTask, 
    updateTask, 
    addNotification,
    sidebarCollapsed,
    toggleSidebar
  } = useApp();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigneeId: user?.id || '',
    projectId: searchParams.get('project') || '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'todo' as 'todo' | 'in-progress' | 'completed',
    dueDate: '',
  });

  const isEditing = !!taskId;
  const task = isEditing ? tasks.find(t => t.id === taskId) : null;

  useEffect(() => {
    if (isEditing && task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        assigneeId: task.assigneeId || user?.id || '',
        projectId: task.projectId || '',
        priority: task.priority || 'medium',
        status: task.status || 'todo',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    }
  }, [isEditing, task, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      addNotification({
        title: 'Authentication Required',
        message: 'You must be logged in to create a task',
        type: 'error',
        read: false,
        createdAt: new Date(),
      });
      return;
    }

    if (!formData.projectId) {
      addNotification({
        title: 'Validation Error',
        message: 'Please select a project',
        type: 'error',
        read: false,
        createdAt: new Date(),
      });
      return;
    }

    setLoading(true);

    try {
      const taskData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
      };

      if (isEditing && task) {
        const updatedTask = await updateTask(task.id, taskData);
        if (updatedTask) {
          addNotification({
            title: 'Task Updated',
            message: 'Task updated successfully!',
            type: 'success',
            read: false,
            createdAt: new Date(),
          });
          navigate(`/tasks/${task.id}`);
        }
      } else {
        const newTask = await createTask(taskData);
        
        if (newTask) {
          addNotification({
            title: 'Task Created',
            message: 'Task created successfully!',
            type: 'success',
            read: false,
            createdAt: new Date(),
          });
          navigate('/mytasks');
        }
      }
    } catch (error) {
      console.error('Error saving task:', error);
      addNotification({
        title: 'Error',
        message: 'Failed to save task. Please try again.',
        type: 'error',
        read: false,
        createdAt: new Date(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isEditing && task) {
      navigate(`/tasks/${task.id}`);
    } else {
      navigate('/mytasks');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={toggleSidebar} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuClick={toggleSidebar}
          title={isEditing ? 'Edit Task' : 'Create Task'}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="flex items-center mb-6">
                <button
                  onClick={handleCancel}
                  className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {isEditing ? 'Edit Task' : 'Create New Task'}
                  </h1>
                  <p className="text-gray-600">
                    {isEditing ? 'Update your task details' : 'Fill in the details to create a new task'}
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Task Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="input"
                        placeholder="Enter task title"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="input"
                        placeholder="Describe your task..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project *
                      </label>
                      <select
                        name="projectId"
                        value={formData.projectId}
                        onChange={handleInputChange}
                        required
                        className="input"
                      >
                        <option value="">Select a project</option>
                        {projects.map(project => (
                          <option key={project.id} value={project.id}>
                            {project.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assignee
                      </label>
                      <input
                        type="text"
                        value={user?.name || ''}
                        disabled
                        className="input bg-gray-50"
                        placeholder="Current user"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="input"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="input"
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleInputChange}
                        className="input"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-outline"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading || !formData.title.trim() || !formData.projectId}
                    className="btn btn-primary"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : (isEditing ? 'Update Task' : 'Create Task')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskCreate;