import React, { useState } from 'react';
import { 
  Inbox, 
  Briefcase, 
  User, 
  CheckCircle, 
  Calendar,
  Star,
  Archive,
  Plus,
  Heart,
  Home,
  Book,
  Music,
  Camera,
  Gamepad2,
  Coffee,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import { useCategories } from '../contexts/CategoryContext';
import CreateCategoryModal from './CreateCategoryModal';
import EditCategoryModal from './EditCategoryModal';
import ConfirmDialog from './ConfirmDialog';
import Toast from './Toast';

const iconMap = {
  Inbox, Briefcase, User, CheckCircle, Calendar, Star, Archive, Plus,
  Heart, Home, Book, Music, Camera, Gamepad2, Coffee
};

const Sidebar = ({ isDark, activeFilter, onFilterChange, stats = {} }) => {
  const { categories, createCategory, updateCategory, deleteCategory } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleCreateCategory = async (categoryData) => {
    try {
      const result = await createCategory(categoryData);
      if (result.success) {
        showToast(`Category '${categoryData.name}' created successfully!`);
        setIsModalOpen(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      showToast(error.message || 'Failed to create category', 'error');
      throw error;
    }
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
    setDropdownOpen(null);
  };

  const handleUpdateCategory = async (categoryData) => {
    try {
      const result = await updateCategory(selectedCategory.id, categoryData);
      if (result.success) {
        showToast(`Category updated successfully!`);
        setIsEditModalOpen(false);
        setSelectedCategory(null);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      showToast(error.message || 'Failed to update category', 'error');
      throw error;
    }
  };

  const handleDeleteCategory = (category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
    setDropdownOpen(null);
  };

  const confirmDeleteCategory = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteCategory(selectedCategory.id);
      if (result.success) {
        showToast(`Category '${selectedCategory.name}' deleted successfully!`);
        setIsDeleteDialogOpen(false);
        setSelectedCategory(null);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      showToast(error.message || 'Failed to delete category', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleDropdown = (categoryId) => {
    setDropdownOpen(dropdownOpen === categoryId ? null : categoryId);
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
    <>
      <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 ${
        isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      } border-r transition-all duration-300 overflow-y-auto hidden lg:block`} onClick={() => setDropdownOpen(null)}>
        
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
          {categories.map((item) => {
            const IconComponent = iconMap[item.icon] || Inbox;
            const isActive = activeFilter === item.id;
            const colorClass = getColorClass(item.color);
            const isCustom = item.isCustom;
            
            return (
              <div key={item.id} className="relative">
                <button
                  onClick={() => onFilterChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-200 group animate-in slide-in-from-left-2 ${
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
                    <IconComponent className={`h-5 w-5 ${
                      isActive ? colorClass : isDark ? 'text-gray-400' : 'text-gray-500'
                    } group-hover:${colorClass} transition-colors duration-200`} />
                    <span className="font-medium text-sm flex-1">
                      {item.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {(stats[item.id] > 0 || item.count > 0) && (
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        isActive
                          ? isDark
                            ? 'bg-primary-800 text-primary-200'
                            : 'bg-primary-100 text-primary-700'
                          : isDark
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-100 text-gray-600'
                      }`}>
                        {stats[item.id] || item.count || 0}
                      </span>
                    )}
                    
                    {isCustom && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(item.id);
                        }}
                        className={`p-1 rounded-md transition-colors ${
                          isDark 
                            ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </button>
                
                {/* Dropdown Menu */}
                {isCustom && dropdownOpen === item.id && (
                  <div className={`absolute right-2 top-full mt-1 w-48 rounded-lg shadow-lg border z-10 ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-200'
                  }`} onClick={(e) => e.stopPropagation()}>
                    <div className="py-1">
                      <button
                        onClick={() => handleEditCategory(item)}
                        className={`w-full flex items-center px-3 py-2 text-sm transition-colors ${
                          isDark 
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Edit className="h-4 w-4 mr-3" />
                        Edit Category
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(item)}
                        className={`w-full flex items-center px-3 py-2 text-sm transition-colors ${
                          isDark 
                            ? 'text-red-400 hover:bg-gray-700 hover:text-red-300' 
                            : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                        }`}
                      >
                        <Trash2 className="h-4 w-4 mr-3" />
                        Delete Category
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <div className="space-y-2">
            <button 
              onClick={() => setIsModalOpen(true)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                isDark 
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-700 hover:border-gray-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200 hover:border-gray-300'
              }`}
            >
              <Plus className="h-4 w-4 group-hover:text-primary-500 transition-colors" />
              <span className="text-sm font-medium">Add Category</span>
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

      {/* Create Category Modal */}
      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCategory}
        isDark={isDark}
      />

      {/* Edit Category Modal */}
      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateCategory}
        category={selectedCategory}
        isDark={isDark}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => !isDeleting && setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteCategory}
        title="Delete Category"
        message={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isDark={isDark}
        isLoading={isDeleting}
      />

      {/* Toast Notification */}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </>
  );
};

export default Sidebar;
