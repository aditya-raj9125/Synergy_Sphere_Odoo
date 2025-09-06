import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, Image as ImageIcon, Save, X } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { mockUsers } from '../data/mockData';
import { Project } from '../types';

const ProjectCreate: React.FC = () => {
  const { projectId } = useParams<{ projectId?: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manager: user?.id || '',
    deadline: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    tags: '',
    image: null as File | null,
  });

  const isEditing = !!projectId;
  const project = isEditing ? state.projects.find(p => p.id === projectId) : null;

  useEffect(() => {
    if (isEditing && project) {
      setFormData({
        name: project.name,
        description: project.description,
        manager: project.manager.id,
        deadline: project.deadline.toISOString().split('T')[0],
        priority: project.priority,
        tags: project.tags.join(', '),
        image: null,
      });
    }
  }, [isEditing, project]);

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
      const manager = mockUsers.find(u => u.id === formData.manager);
      if (!manager) throw new Error('Manager not found');

      const projectData: Project = {
        id: isEditing ? projectId! : Date.now().toString(),
        name: formData.name,
        description: formData.description,
        manager,
        members: isEditing ? project?.members || [] : [manager],
        deadline: new Date(formData.deadline),
        priority: formData.priority,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        progress: isEditing ? project?.progress || 0 : 0,
        createdAt: isEditing ? project?.createdAt || new Date() : new Date(),
        updatedAt: new Date(),
      };

      if (isEditing) {
        dispatch({ type: 'UPDATE_PROJECT', payload: projectData });
      } else {
        dispatch({ type: 'ADD_PROJECT', payload: projectData });
      }

      navigate(isEditing ? `/projects/${projectId}` : '/dashboard');
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    if (isEditing) {
      navigate(`/projects/${projectId}`);
    } else {
      navigate('/dashboard');
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
          title={isEditing ? 'Project Edit' : 'Project Create'}
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
                    {isEditing ? 'Edit Project' : 'Create New Project'}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {isEditing ? 'Update your project details' : 'Fill in the details to create a new project'}
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
                    form="project-form"
                    disabled={loading}
                    className="btn btn-primary flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? 'Saving...' : 'Save'}</span>
                  </button>
                </div>
              </div>

              {/* Form */}
              <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Project Name */}
                    <div className="md:col-span-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Project Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="input w-full"
                        placeholder="Enter project name"
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
                        placeholder="Describe your project..."
                      />
                    </div>

                    {/* Project Manager */}
                    <div>
                      <label htmlFor="manager" className="block text-sm font-medium text-gray-700 mb-2">
                        Project Manager *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          id="manager"
                          name="manager"
                          required
                          value={formData.manager}
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

                    {/* Deadline */}
                    <div>
                      <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                        Deadline *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          id="deadline"
                          name="deadline"
                          required
                          value={formData.deadline}
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
                    <div>
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
                        Project Image
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

export default ProjectCreate;
