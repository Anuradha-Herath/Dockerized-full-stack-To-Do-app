import React, { useState } from 'react';
import { Search, Sun, Moon, User, Settings, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const TopNavigation = ({ searchQuery, onSearchChange }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className={`sticky top-0 z-40 ${
      isDark ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'
    } backdrop-blur-sm border-b transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* App Title */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                TaskFlow
              </h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border border-transparent rounded-lg leading-5 ${
                  isDark 
                    ? 'bg-gray-800 text-white placeholder-gray-400 focus:bg-gray-700 focus:border-primary-500' 
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20'
                } focus:outline-none transition-all duration-200`}
                placeholder="Search tasks..."
              />
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notifications */}
            <button
              className={`p-2 rounded-lg transition-all duration-200 relative ${
                isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              {/* Notification dot */}
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  {user?.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <span className={`hidden md:block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {user?.name || 'User'}
                </span>
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                } ring-1 ring-black ring-opacity-5 animate-scale-in`}>
                  <div className="py-1">
                    <div className={`px-4 py-2 border-b ${
                      isDark ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <p className={`text-sm font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {user?.name || 'User'}
                      </p>
                      <p className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {user?.email}
                      </p>
                    </div>
                    
                    <button
                      className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 transition-colors duration-200 ${
                        isDark 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 transition-colors duration-200 ${
                        isDark 
                          ? 'text-red-400 hover:bg-red-900/20' 
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
