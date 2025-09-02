import React, { useState, useEffect } from 'react';
import { X, Inbox, Calendar, Briefcase, User, Star, Heart, Home, Book, Music, Camera, Gamepad2, Coffee } from 'lucide-react';

const EditCategoryModal = ({ isOpen, onClose, onSubmit, category, isDark }) => {
  const [categoryName, setCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [selectedIcon, setSelectedIcon] = useState('Inbox');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colorOptions = [
    { name: 'blue', value: '#3B82F6', class: 'bg-blue-500' },
    { name: 'green', value: '#10B981', class: 'bg-green-500' },
    { name: 'purple', value: '#8B5CF6', class: 'bg-purple-500' },
    { name: 'pink', value: '#EC4899', class: 'bg-pink-500' },
    { name: 'yellow', value: '#F59E0B', class: 'bg-yellow-500' },
    { name: 'red', value: '#EF4444', class: 'bg-red-500' },
    { name: 'indigo', value: '#6366F1', class: 'bg-indigo-500' },
    { name: 'teal', value: '#14B8A6', class: 'bg-teal-500' }
  ];

  const iconOptions = [
    { name: 'Inbox', component: Inbox },
    { name: 'Calendar', component: Calendar },
    { name: 'Briefcase', component: Briefcase },
    { name: 'User', component: User },
    { name: 'Star', component: Star },
    { name: 'Heart', component: Heart },
    { name: 'Home', component: Home },
    { name: 'Book', component: Book },
    { name: 'Music', component: Music },
    { name: 'Camera', component: Camera },
    { name: 'Gamepad2', component: Gamepad2 },
    { name: 'Coffee', component: Coffee }
  ];

  useEffect(() => {
    if (isOpen && category) {
      setCategoryName(category.name || '');
      setSelectedColor(category.color || 'blue');
      setSelectedIcon(category.icon || 'Inbox');
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen, category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setError('Category name is required');
      return;
    }

    if (categoryName.trim().length < 2) {
      setError('Category name must be at least 2 characters');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit({
        name: categoryName.trim(),
        color: selectedColor,
        icon: selectedIcon
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen || !category) return null;

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
            <h3 className={`text-lg font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Edit Category
            </h3>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Category Name
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                  setError('');
                }}
                onKeyDown={handleKeyDown}
                autoFocus
                placeholder="Enter category name..."
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } ${error ? 'border-red-500' : ''}`}
                maxLength={30}
              />
              {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
              )}
            </div>

            {/* Color Picker */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Choose Color
              </label>
              <div className="grid grid-cols-4 gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-10 h-10 rounded-lg ${color.class} transition-all duration-200 ${
                      selectedColor === color.name
                        ? 'ring-2 ring-offset-2 ring-primary-500 scale-110'
                        : 'hover:scale-105'
                    } ${isDark ? 'ring-offset-gray-800' : 'ring-offset-white'}`}
                  />
                ))}
              </div>
            </div>

            {/* Icon Picker */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Choose Icon
              </label>
              <div className="grid grid-cols-6 gap-2">
                {iconOptions.map((icon) => {
                  const IconComponent = icon.component;
                  return (
                    <button
                      key={icon.name}
                      type="button"
                      onClick={() => setSelectedIcon(icon.name)}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        selectedIcon === icon.name
                          ? isDark
                            ? 'bg-primary-900 text-primary-300 ring-2 ring-primary-500'
                            : 'bg-primary-100 text-primary-700 ring-2 ring-primary-500'
                          : isDark
                            ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !categoryName.trim()}
                className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                  isSubmitting || !categoryName.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {isSubmitting ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModal;
