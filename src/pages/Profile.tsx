import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Bell, Shield, HelpCircle } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { 
    projects, 
    tasks, 
    addNotification,
    sidebarCollapsed,
    toggleSidebar
  } = useApp();
  const { user, logout } = useAuth();
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    taskUpdates: true,
    projectUpdates: false,
    mentions: true,
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to the backend
    addNotification({
      title: 'Settings Saved',
      message: 'Settings saved successfully!',
      type: 'success',
      read: false,
      createdAt: new Date(),
    });
  };

  const userProjects = projects.filter(project => project.ownerId === user?.id);
  const userTasks = tasks.filter(task => task.assigneeId === user?.id);
  const completedTasks = userTasks.filter(task => task.status === 'completed').length;
  const activeProjects = userProjects.filter(project => project.status === 'active').length;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={toggleSidebar} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuClick={toggleSidebar}
          title="Profile"
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            <div className="max-w-4xl mx-auto">
              {/* Profile Header */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center space-x-6">
                  <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-600">
                      {user?.initials || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                    <p className="text-gray-600">{user?.email}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500">
                        {userProjects.length} Projects
                      </span>
                      <span className="text-sm text-gray-500">
                        {userTasks.length} Tasks
                      </span>
                      <span className="text-sm text-gray-500">
                        {completedTasks} Completed
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">P</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Total Projects</p>
                      <p className="text-2xl font-bold text-gray-900">{userProjects.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold text-sm">A</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Active Projects</p>
                      <p className="text-2xl font-bold text-gray-900">{activeProjects}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 font-bold text-sm">T</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                      <p className="text-2xl font-bold text-gray-900">{userTasks.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-sm">✓</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Account Settings */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Account Settings
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={user?.name || ''}
                        disabled
                        className="input bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="input bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        User ID
                      </label>
                      <input
                        type="text"
                        value={user?.id || ''}
                        disabled
                        className="input bg-gray-50 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notifications
                  </h2>
                  
                  <div className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {key === 'email' && 'Receive email notifications'}
                            {key === 'push' && 'Receive push notifications'}
                            {key === 'taskUpdates' && 'Get notified about task updates'}
                            {key === 'projectUpdates' && 'Get notified about project updates'}
                            {key === 'mentions' && 'Get notified when mentioned'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange(key)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={handleSaveSettings}
                    className="mt-4 btn btn-primary w-full"
                  >
                    Save Settings
                  </button>
                </div>
              </div>

              {/* Additional Settings */}
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Privacy & Security
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Manage your privacy settings and security preferences.
                  </p>
                  <button className="btn btn-outline">
                    Privacy Settings
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Help & Support
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Get help, report issues, or contact support.
                  </p>
                  <button className="btn btn-outline">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;