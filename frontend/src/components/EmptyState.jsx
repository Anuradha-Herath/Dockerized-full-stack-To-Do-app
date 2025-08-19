import React from 'react';
import { CheckCircle, Plus, Calendar, Briefcase, User, Star } from 'lucide-react';

const EmptyState = ({ isDark, filter, onAddTask }) => {
  const getEmptyStateContent = () => {
    switch (filter) {
      case 'completed':
        return {
          icon: CheckCircle,
          title: 'No completed tasks yet',
          description: 'Complete some tasks to see them here',
          actionText: 'View all tasks',
          action: () => onAddTask(),
          illustration: '🎯'
        };
      case 'today':
        return {
          icon: Calendar,
          title: 'No tasks for today',
          description: 'Add some tasks to make your day productive',
          actionText: 'Add today\'s task',
          action: () => onAddTask({ category: 'today' }),
          illustration: '📅'
        };
      case 'work':
        return {
          icon: Briefcase,
          title: 'No work tasks',
          description: 'Add work-related tasks to stay organized',
          actionText: 'Add work task',
          action: () => onAddTask({ category: 'work' }),
          illustration: '💼'
        };
      case 'personal':
        return {
          icon: User,
          title: 'No personal tasks',
          description: 'Add personal tasks to track your goals',
          actionText: 'Add personal task',
          action: () => onAddTask({ category: 'personal' }),
          illustration: '🏠'
        };
      case 'important':
        return {
          icon: Star,
          title: 'No important tasks',
          description: 'Mark tasks as important to prioritize them',
          actionText: 'Add important task',
          action: () => onAddTask({ category: 'important', priority: 'high' }),
          illustration: '⭐'
        };
      default:
        return {
          icon: Plus,
          title: 'No tasks yet',
          description: 'Create your first task to get started with better productivity',
          actionText: 'Create your first task',
          action: () => onAddTask(),
          illustration: '🚀'
        };
    }
  };

  const content = getEmptyStateContent();
  const Icon = content.icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      
      {/* Illustration */}
      <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 ${
        isDark ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <span className="text-6xl">{content.illustration}</span>
      </div>

      {/* Content */}
      <div className="max-w-md">
        <h3 className={`text-2xl font-bold mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {content.title}
        </h3>
        
        <p className={`text-lg mb-8 leading-relaxed ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {content.description}
        </p>

        {/* Action Button */}
        <button
          onClick={content.action}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 transform"
        >
          <Icon className="w-5 h-5" />
          <span>{content.actionText}</span>
        </button>

        {/* Secondary Actions */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => onAddTask({ category: 'today' })}
            className={`text-sm px-4 py-2 rounded-lg transition-all duration-200 ${
              isDark 
                ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            📅 Add today's task
          </button>
          
          <button
            onClick={() => onAddTask({ category: 'work' })}
            className={`text-sm px-4 py-2 rounded-lg transition-all duration-200 ${
              isDark 
                ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            💼 Add work task
          </button>
          
          <button
            onClick={() => onAddTask({ category: 'personal' })}
            className={`text-sm px-4 py-2 rounded-lg transition-all duration-200 ${
              isDark 
                ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            🏠 Add personal task
          </button>
        </div>
      </div>

      {/* Motivational Quote */}
      <div className={`mt-12 p-6 rounded-2xl max-w-lg ${
        isDark ? 'bg-gray-800/50' : 'bg-gray-50'
      }`}>
        <p className={`text-sm italic ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          "The secret of getting ahead is getting started."
        </p>
        <p className={`text-xs mt-2 ${
          isDark ? 'text-gray-500' : 'text-gray-500'
        }`}>
          — Mark Twain
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
