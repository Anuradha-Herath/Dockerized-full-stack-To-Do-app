import React from 'react';
import { 
  Inbox, 
  Briefcase, 
  User, 
  CheckCircle, 
  Calendar,
  Star,
  Archive,
  Plus
} from 'lucide-react';

const Sidebar = ({ isDark, activeFilter, onFilterChange, stats = {} }) => {
  const sidebarItems = [
    {
      id: 'all',
      label: 'All Tasks',
      icon: Inbox,
      count: stats.total || 0,
      color: 'text-blue-500'
    },
    {
      id: 'today',
      label: 'Today',
      icon: Calendar,
      count: stats.today || 0,
      color: 'text-green-500'
    },
    {
      id: 'work',
      label: 'Work',
      icon: Briefcase,
      count: stats.work || 0,
      color: 'text-purple-500'
    },
    {
      id: 'personal',
      label: 'Personal',
      icon: User,
      count: stats.personal || 0,
      color: 'text-pink-500'
    },
    {
      id: 'important',
      label: 'Important',
      icon: Star,
      count: stats.important || 0,
      color: 'text-yellow-500'
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: CheckCircle,
      count: stats.completed || 0,
      color: 'text-green-600'
    },
    {
      id: 'archived',
      label: 'Archived',
      icon: Archive,
      count: stats.archived || 0,
      color: 'text-gray-500'
    }
  ];

  return (
    <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 ${
      isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    } border-r transition-all duration-300 overflow-y-auto hidden lg:block`}>
      
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className={`text-lg font-semibold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          My Workspace
        </h2>
        <p className={`text-sm mt-1 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Organize your tasks efficiently
        </p>
      </div>

      {/* Navigation Items */}
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeFilter === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onFilterChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                isActive
                  ? isDark
                    ? 'bg-primary-900/50 text-primary-300 border border-primary-700'
                    : 'bg-primary-50 text-primary-700 border border-primary-200'
                  : isDark
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`h-5 w-5 ${
                  isActive ? item.color : isDark ? 'text-gray-400' : 'text-gray-500'
                } group-hover:${item.color} transition-colors duration-200`} />
                <span className="font-medium text-sm">
                  {item.label}
                </span>
              </div>
              
              {item.count > 0 && (
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  isActive
                    ? isDark
                      ? 'bg-primary-800 text-primary-200'
                      : 'bg-primary-100 text-primary-700'
                    : isDark
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-100 text-gray-600'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="space-y-2">
          <button className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
            isDark 
              ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}>
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">Create Category</span>
          </button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className={`p-4 m-4 rounded-lg ${
        isDark ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <h3 className={`text-sm font-medium mb-2 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Today's Progress
        </h3>
        <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2`}>
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${stats.completionRate || 0}%` }}
          ></div>
        </div>
        <p className={`text-xs ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {stats.completed || 0} of {stats.total || 0} tasks completed
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
