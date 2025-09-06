import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const ProjectCreate: React.FC = () => {
  const { projectId } = useParams<{ projectId?: string }>();
  const navigate = useNavigate();
  const { 
    projects, 
    createProject, 
    updateProject, 
    addNotification,
    sidebarCollapsed,
    toggleSidebar
  } = useApp();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'active' as 'active' | 'completed' | 'on-hold',
  });

  const isEditing = !!projectId;
  const project = isEditing ? projects.find(p => p.id === projectId) : null;

  useEffect(() => {
    if (isEditing && project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        status: project.status || 'active',
      });
    }
  }, [isEditing, project]);

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
        message: 'You must be logged in to create a project',
        type: 'error',
        read: false,
        createdAt: new Date(),
      });
      return;
    }

    setLoading(true);

    try {
      if (isEditing && project) {
        const updatedProject = await updateProject(project.id, formData);
        if (updatedProject) {
          addNotification({
            title: 'Project Updated',
            message: 'Project updated successfully!',
            type: 'success',
            read: false,
            createdAt: new Date(),
          });
          navigate(`/projects/${project.id}`);
        }
      } else {
        const newProject = await createProject({
          ...formData,
          ownerId: user.id,
        });
        
        if (newProject) {
          addNotification({
            title: 'Project Created',
            message: 'Project created successfully!',
            type: 'success',
            read: false,
            createdAt: new Date(),
          });
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Error saving project:', error);
      addNotification({
        title: 'Error',
        message: 'Failed to save project. Please try again.',
        type: 'error',
        read: false,
        createdAt: new Date(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isEditing && project) {
      navigate(`/projects/${project.id}`);
    } else {
      navigate('/dashboard');
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
          title={isEditing ? 'Edit Project' : 'Create Project'}
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
                    {isEditing ? 'Edit Project' : 'Create New Project'}
                  </h1>
                  <p className="text-gray-600">
                    {isEditing ? 'Update your project details' : 'Fill in the details to create a new project'}
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="input"
                        placeholder="Enter project title"
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
                        placeholder="Describe your project..."
                      />
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
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="on-hold">On Hold</option>
                      </select>
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
                    disabled={loading || !formData.title.trim()}
                    className="btn btn-primary"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project')}
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

export default ProjectCreate;