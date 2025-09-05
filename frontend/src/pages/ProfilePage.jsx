import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Download,
  Trash2,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileNavigation from '../components/MobileNavigation';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    pushNotifications: false,
    weeklyDigest: true
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field, value) => {
    setNotifications(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    // Simulate data export
    const data = {
      user: user,
      exportDate: new Date().toISOString(),
      settings: { notifications, theme: isDark ? 'dark' : 'light' }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'todomaster-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setMessage({ type: 'success', text: 'Data exported successfully!' });
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      logout();
      navigate('/');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-background-dark' : 'bg-background-light'
    }`}>
      
      {/* Header */}
      <header className={`${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-surface border-gray-200'
      } border-b transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isDark 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              } mr-4`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className={`text-xl font-bold ${
              isDark ? 'text-white' : 'text-text-primary'
            }`}>
              Profile & Settings
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        
        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg border animate-slide-down ${
            message.type === 'success'
              ? 'bg-secondary-50 border-secondary-200 text-secondary-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {message.text}
            <button 
              onClick={() => setMessage({ type: '', text: '' })}
              className="ml-2 hover:text-opacity-75"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className={`${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-surface border-gray-200'
            } rounded-xl p-6 border shadow-sm`}>
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h2 className={`text-xl font-bold ${
                  isDark ? 'text-white' : 'text-text-primary'
                } mb-2`}>
                  {user?.email?.split('@')[0] || 'User'}
                </h2>
                <p className={`${
                  isDark ? 'text-gray-400' : 'text-text-secondary'
                } mb-4`}>
                  {user?.email}
                </p>
                <div className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-text-secondary'
                }`}>
                  Member since {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Theme Toggle */}
            <div className={`${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-surface border-gray-200'
            } rounded-xl p-6 border shadow-sm mt-6`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {isDark ? <Moon className="w-5 h-5 mr-3" /> : <Sun className="w-5 h-5 mr-3" />}
                  <div>
                    <h3 className={`font-medium ${
                      isDark ? 'text-white' : 'text-text-primary'
                    }`}>
                      {isDark ? 'Dark Mode' : 'Light Mode'}
                    </h3>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-text-secondary'
                    }`}>
                      Toggle appearance
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    isDark ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      isDark ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Settings Forms */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Profile Information */}
            <div className={`${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-surface border-gray-200'
            } rounded-xl p-6 border shadow-sm`}>
              <h3 className={`text-lg font-semibold ${
                isDark ? 'text-white' : 'text-text-primary'
              } mb-6`}>
                Profile Information
              </h3>
              
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-text-primary'
                  }`}>
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-text-primary placeholder-gray-500'
                    } focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 focus:outline-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-all duration-200"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div className={`${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-surface border-gray-200'
            } rounded-xl p-6 border shadow-sm`}>
              <h3 className={`text-lg font-semibold ${
                isDark ? 'text-white' : 'text-text-primary'
              } mb-6`}>
                Change Password
              </h3>
              
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-text-primary'
                  }`}>
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={formData.currentPassword}
                      onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                      className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-text-primary placeholder-gray-500'
                      } focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 focus:outline-none`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-text-primary'
                  }`}>
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-text-primary placeholder-gray-500'
                      } focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 focus:outline-none`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-text-primary'
                  }`}>
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-text-primary placeholder-gray-500'
                      } focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 focus:outline-none`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !formData.currentPassword || !formData.newPassword}
                  className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-all duration-200"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>

            {/* Notifications */}
            <div className={`${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-surface border-gray-200'
            } rounded-xl p-6 border shadow-sm`}>
              <h3 className={`text-lg font-semibold ${
                isDark ? 'text-white' : 'text-text-primary'
              } mb-6`}>
                <Bell className="w-5 h-5 inline mr-2" />
                Notification Preferences
              </h3>
              
              <div className="space-y-4">
                {Object.entries({
                  emailUpdates: 'Email updates for task reminders',
                  pushNotifications: 'Browser push notifications',
                  weeklyDigest: 'Weekly progress digest'
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className={`${
                      isDark ? 'text-gray-300' : 'text-text-primary'
                    }`}>
                      {label}
                    </span>
                    <button
                      onClick={() => handleNotificationChange(key, !notifications[key])}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                        notifications[key] ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          notifications[key] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Management */}
            <div className={`${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-surface border-gray-200'
            } rounded-xl p-6 border shadow-sm`}>
              <h3 className={`text-lg font-semibold ${
                isDark ? 'text-white' : 'text-text-primary'
              } mb-6`}>
                Data Management
              </h3>
              
              <div className="space-y-4">
                <button
                  onClick={handleExportData}
                  className={`flex items-center px-4 py-2 rounded-lg border transition-all duration-200 ${
                    isDark
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export My Data
                </button>

                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation isDark={isDark} />
    </div>
  );
};

export default ProfilePage;
