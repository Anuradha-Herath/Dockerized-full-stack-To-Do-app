import React, { useState } from 'react';
import { 
  Inbox, Calendar, Briefcase, User, Star, Heart, Home, Book,
  Music, Camera, Gamepad2, Coffee, Archive, CheckCircle, X, Check
} from 'lucide-react';
import { useCategories } from '../contexts/CategoryContext';

const CategorySelector = ({ 
  isOpen, 
  onClose, 
  onSelectCategory, 
  selectedTasks = [], 
  isDark,
  title = "Move to Category"
}) => {
  const { categories, moveTasksToCategory } = useCategories();
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const iconMap = {
    Inbox, Calendar, Briefcase, User, Star, Heart, Home, Book,
    Music, Camera, Gamepad2, Coffee, Archive, CheckCircle
  };

  const getColorClass = (color) => {
    const colorMap = {
      blue: 'text-blue-500',
      green: 'text-green-500',
      purple: 'text-purple-500',
      pink: 'text-pink-500',
      yellow: 'text-yellow-500',
      red: 'text-red-500',
      indigo: 'text-indigo-500',
      teal: 'text-teal-500',
      gray: 'text-gray-500'
    };
    return colorMap[color] || 'text-blue-500';
  };

  const handleCategorySelect = async (category) => {
    if (!selectedTasks.length) {
      setSelectedCategory(category);
      onSelectCategory?.(category);
      return;
    }

    setLoading(true);
    try {
      const result = await moveTasksToCategory(selectedTasks.map(t => t._id), category);
      if (result.success) {
        onSelectCategory?.(category, result.data);
        onClose();
      } else {
        console.error('Failed to move tasks:', result.error);
      }
    } catch (error) {
      console.error('Error moving tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative w-full max-w-md transform overflow-hidden rounded-xl ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        } p-6 shadow-2xl transition-all duration-300 animate-in fade-in-0 zoom-in-95`}>
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-lg font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {title}
              </h3>
              {selectedTasks.length > 0 && (
                <p className={`text-sm mt-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Categories List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {categories.map((category) => {
              const IconComponent = iconMap[category.icon] || Inbox;
              const colorClass = getColorClass(category.color);
              const isSelected = selectedCategory?.id === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  disabled={loading}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                    isSelected
                      ? isDark
                        ? 'bg-primary-900/50 text-primary-300 border border-primary-700'
                        : 'bg-primary-50 text-primary-700 border border-primary-200'
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white border border-transparent'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`h-5 w-5 ${
                      isSelected ? colorClass : isDark ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <span className="font-medium text-sm">
                      {category.name}
                    </span>
                    {category.isCustom && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                      }`}>
                        Custom
                      </span>
                    )}
                  </div>
                  
                  {isSelected && (
                    <Check className="h-4 w-4 text-primary-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="mt-4 flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
              <span className={`ml-2 text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Moving tasks...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySelector;
