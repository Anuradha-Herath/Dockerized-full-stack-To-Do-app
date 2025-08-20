import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CategoryContext = createContext();

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};

export const CategoryProvider = ({ children }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default categories
  const defaultCategories = [
    { id: 'all', name: 'All Tasks', icon: 'Inbox', color: 'blue', isDefault: true },
    { id: 'today', name: 'Today', icon: 'Calendar', color: 'green', isDefault: true },
    { id: 'work', name: 'Work', icon: 'Briefcase', color: 'purple', isDefault: true },
    { id: 'personal', name: 'Personal', icon: 'User', color: 'pink', isDefault: true },
    { id: 'important', name: 'Important', icon: 'Star', color: 'yellow', isDefault: true },
    { id: 'completed', name: 'Completed', icon: 'CheckCircle', color: 'green', isDefault: true },
    { id: 'archived', name: 'Archived', icon: 'Archive', color: 'gray', isDefault: true }
  ];

  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      const customCategories = response.data || [];
      
      // Transform custom categories to match our format
      const transformedCustomCategories = customCategories.map(cat => ({
        id: cat._id,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        isDefault: false,
        isCustom: true
      }));
      
      setCategories([...defaultCategories, ...transformedCustomCategories]);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(defaultCategories);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData) => {
    try {
      const response = await axios.post('/api/categories', categoryData);
      const newCategory = response.data;
      
      // Transform to match our format
      const transformedCategory = {
        id: newCategory._id,
        name: newCategory.name,
        icon: newCategory.icon,
        color: newCategory.color,
        isDefault: false,
        isCustom: true
      };
      
      setCategories(prev => [...prev, transformedCategory]);
      return { success: true, category: transformedCategory };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to create category';
      return { success: false, error: errorMessage };
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await axios.delete(`/api/categories/${categoryId}`);
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to delete category';
      return { success: false, error: errorMessage };
    }
  };

  const moveTasksToCategory = async (taskIds, targetCategory) => {
    try {
      const payload = targetCategory.isCustom 
        ? { taskIds, categoryId: targetCategory.id }
        : { taskIds, categoryType: targetCategory.id };
        
      const response = await axios.post('/api/tasks/move-to-category', payload);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to move tasks';
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    categories,
    loading,
    createCategory,
    deleteCategory,
    fetchCategories,
    moveTasksToCategory,
    defaultCategories
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};
