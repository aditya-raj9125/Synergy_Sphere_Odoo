import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, Image as ImageIcon, Save, X } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { mockUsers, mockProjects } from '../data/mockData';
import { Task } from '../types';

const TaskCreate: React.FC = () => {
  const { taskId } = useParams<{ taskId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: user?.id || '',
    project: searchParams.get('project') || '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    dueDate: '',
    tags: '',
    image: null as File | null,
  });

  const isEditing = !!taskId;
  const task = isEditing ? state.tasks.find(t => t.id === taskId) : null;

  useEffect(() => {
    if (isEditing && task) {
      setFormData({
        title: task.title,
        description: task.description,
        assignee: task.assignee.id,
        project: task.project.id,
        priority: task.priority,
        dueDate: task.dueDate.toISOString().split('T')[0],
        tags: task.tags.join(', '),
        image: null,
      });
    }
  }, [isEditing, task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const assignee = mockUsers.find(u => u.id === formData.assignee);
      const project = mockProjects.find(p => p.id === formData.project);
      
      if (!assignee) throw new Error('Assignee not found');
      if (!project) throw new Error('Project not found');

      const taskData: Task = {
        id: isEditing ? taskId! : Date.now().toString(),
        title: formData.title,
        description: formData.description,
        assignee,
        project,
        status: isEditing ? task?.status || 'To-Do' : 'To-Do',
        priority: formData.priority,
        dueDate: new Date(formData.dueDate),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        createdAt: isEditing ? task?.createdAt || new Date() : new Date(),
        updatedAt: new Date(),
      };

      if (isEditing) {
        dispatch({ type: 'UPDATE_TASK', payload: taskData });
      } else {
        dispatch({ type: 'ADD_TASK', payload: taskData });
      }

      navigate(isEditing ? `/tasks/${taskId}` : formData.project ? `/projects/${formData.project}` : '/my-tasks');
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    if (isEditing) {
      navigate(`/tasks/${taskId}`);
    } else if (formData.project) {
      navigate(`/projects/${formData.project}`);
    } else {
      navigate('/my-tasks');
    }
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
          title={isEditing ? 'Task Edit' : 'Task Create'}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="flex items-center space-x-4 mb-6">
                <button
                  onClick={handleDiscard}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {isEditing ? 'Edit Task' : 'Create New Task'}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {isEditing ? 'Update your task details' : 'Fill in the details to create a new task'}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={handleDiscard}
                    className="btn btn-outline flex items-center space-x-2"
                  >
                    <X className="h-4 w-4" />
                    <span>Discard</span>
                  </button>
                  <button
                    type="submit"
                    form="task-form"
                    disabled={loading}
                    className="btn btn-primary flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? 'Saving...' : 'Save'}</span>
                  </button>
                </div>
              </div>

              {/* Form */}
              <form id="task-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Task Title */}
                    <div className="md:col-span-2">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Task Title *
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="input w-full"
                        placeholder="Enter task title"
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="input w-full resize-none"
                        placeholder="Describe the task..."
                      />
                    </div>

                    {/* Assignee */}
                    <div>
                      <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-2">
                        Assignee *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          id="assignee"
                          name="assignee"
                          required
                          value={formData.assignee}
                          onChange={handleChange}
                          className="input pl-10 w-full"
                        >
                          {mockUsers.map(user => (
                            <option key={user.id} value={user.id}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Project */}
                    <div>
                      <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
                        Project *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Tag className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          id="project"
                          name="project"
                          required
                          value={formData.project}
                          onChange={handleChange}
                          className="input pl-10 w-full"
                        >
                          <option value="">Select a project</option>
                          {mockProjects.map(project => (
                            <option key={project.id} value={project.id}>
                              {project.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Due Date */}
                    <div>
                      <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Due Date *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          id="dueDate"
                          name="dueDate"
                          required
                          value={formData.dueDate}
                          onChange={handleChange}
                          className="input pl-10 w-full"
                        />
                      </div>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority *
                      </label>
                      <div className="space-y-2">
                        {['Low', 'Medium', 'High'].map((priority) => (
                          <label key={priority} className="flex items-center">
                            <input
                              type="radio"
                              name="priority"
                              value={priority}
                              checked={formData.priority === priority}
                              onChange={handleChange}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-gray-700">{priority}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="md:col-span-2">
                      <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Tag className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="tags"
                          name="tags"
                          value={formData.tags}
                          onChange={handleChange}
                          className="input pl-10 w-full"
                          placeholder="Enter tags separated by commas"
                        />
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div className="md:col-span-2">
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                        Task Image
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="input w-full"
                          />
                        </div>
                        {formData.image && (
                          <div className="flex items-center space-x-2">
                            <ImageIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">{formData.image.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
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
