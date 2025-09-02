import React, { useState, useEffect } from 'react';
import { 
  X, Calendar, Flag, AlignLeft, Briefcase, User, Star, Inbox,
  Heart, Home, Book, Music, Camera, Gamepad2, Coffee, Archive, CheckCircle
} from 'lucide-react';
import { useCategories } from '../contexts/CategoryContext';

const TaskModal = ({ task, isOpen, onClose, onSave, isDark, initialCategory = null }) => {
  const { categories } = useCategories();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: 'all'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      // Handle existing task - determine category value
      let categoryValue = 'all';
      if (task.category && task.category._id) {
        // Custom category
        categoryValue = task.category._id;
      } else if (task.categoryType) {
        // Default category
        categoryValue = task.categoryType;
      }
      
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        category: categoryValue
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0],
        category: initialCategory || 'all'
      });
    }
  }, [task, initialCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    try {
      // Transform category data for backend
      const categoryData = transformCategoryForBackend(formData.category);
      
      await onSave({
        ...formData,
        ...categoryData,
        title: formData.title.trim(),
        description: formData.description.trim()
      });
    } finally {
      setLoading(false);
    }
  };

  const transformCategoryForBackend = (categoryId) => {
    // Find the category in the categories list
    const selectedCategory = categories.find(cat => cat.id === categoryId);
    
    if (!selectedCategory) {
      return { categoryType: 'all' };
    }
    
    if (selectedCategory.isCustom) {
      // Custom category - send as ObjectId reference
      return {
        category: selectedCategory.id,
        categoryType: 'custom'
      };
    } else {
      // Default category - send as categoryType only
      return {
        categoryType: selectedCategory.id
      };
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  // Get icon map for displaying categories
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-surface border-gray-200'
      } rounded-2xl shadow-2xl border max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }">
          <h2 className={`text-xl font-bold ${
            isDark ? 'text-white' : 'text-text-primary'
          }`}>
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDark
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Title */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-text-primary'
            }`}>
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-primary-500'
                  : 'bg-white border-gray-300 text-text-primary placeholder-gray-500 focus:border-primary-500'
              } focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 focus:outline-none`}
              placeholder="What needs to be done?"
              maxLength={100}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-text-primary'
            }`}>
              <AlignLeft className="w-4 h-4 inline mr-1" />
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-primary-500'
                  : 'bg-white border-gray-300 text-text-primary placeholder-gray-500 focus:border-primary-500'
              } focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 focus:outline-none resize-none`}
              placeholder="Add more details about this task..."
              rows={4}
              maxLength={500}
            />
          </div>

          {/* Category */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${
              isDark ? 'text-gray-300' : 'text-text-primary'
            }`}>
              <Inbox className="w-4 h-4 inline mr-1" />
              Category
            </label>
            <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
              {categories.map((category) => {
                const IconComponent = iconMap[category.icon] || Inbox;
                const colorClass = getColorClass(category.color);
                
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleChange('category', category.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                      formData.category === category.id
                        ? isDark
                          ? 'bg-primary-900/50 text-primary-300 border-primary-700'
                          : 'bg-primary-50 text-primary-700 border-primary-200'
                        : isDark
                          ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${formData.category === category.id ? colorClass : ''}`} />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-text-primary'
            }`}>
              <Flag className="w-4 h-4 inline mr-1" />
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'low', label: 'Low', color: 'bg-secondary-100 text-secondary-800 border-secondary-200' },
                { value: 'medium', label: 'Medium', color: 'bg-warning-100 text-warning-800 border-warning-200' },
                { value: 'high', label: 'High', color: 'bg-red-100 text-red-800 border-red-200' }
              ].map(({ value, label, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleChange('priority', value)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                    formData.priority === value
                      ? color
                      : isDark
                        ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-text-primary'
            }`}>
              <Calendar className="w-4 h-4 inline mr-1" />
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-primary-500'
                  : 'bg-white border-gray-300 text-text-primary focus:border-primary-500'
              } focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 focus:outline-none`}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-3 rounded-lg border transition-all duration-200 ${
                isDark
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.title.trim() || loading}
              className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {task ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                task ? 'Update Task' : 'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
