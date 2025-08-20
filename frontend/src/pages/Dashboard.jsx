import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useCategories } from '../contexts/CategoryContext';
import { useNavigate } from 'react-router-dom';
import { format, isToday, isThisWeek, isPast } from 'date-fns';
import axios from 'axios';

// Modern Components
import TopNavigation from '../components/TopNavigation';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import FloatingActionButton from '../components/FloatingActionButton';
import EmptyState from '../components/EmptyState';
import LoadingSpinner, { TaskCardSkeleton } from '../components/LoadingSpinner';
import MobileNavigation from '../components/MobileNavigation';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [initialCategory, setInitialCategory] = useState(null);

  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { categories } = useCategories();
  const navigate = useNavigate();

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/tasks');
      console.log('📋 Frontend received tasks response:', response.data);
      
      const tasksData = Array.isArray(response.data) 
        ? response.data 
        : Array.isArray(response.data.tasks) 
          ? response.data.tasks 
          : [];
          
      setTasks(tasksData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
      setTasks([]);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add/Update task
  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        const response = await axios.put(`/api/tasks/${editingTask._id}`, taskData);
        setTasks(prev => 
          prev.map(task => 
            task._id === editingTask._id ? response.data : task
          )
        );
      } else {
        const response = await axios.post('/api/tasks', taskData);
        setTasks(prev => [response.data, ...prev]);
      }
      setShowTaskModal(false);
      setEditingTask(null);
      setInitialCategory(null);
      setError(null);
    } catch (err) {
      setError(editingTask ? 'Failed to update task' : 'Failed to create task');
      console.error('Error saving task:', err);
    }
  };

  // Toggle task completion
  const toggleTask = async (id, completed) => {
    try {
      const response = await axios.put(`/api/tasks/${id}`, { completed });
      setTasks(prev => 
        prev.map(task => 
          task._id === id ? response.data : task
        )
      );
      setError(null);
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(prev => prev.filter(task => task._id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  // Handle edit task
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  // Handle add task with category
  const handleAddTask = (options = {}) => {
    console.log('handleAddTask called with options:', options);
    setEditingTask(null);
    setInitialCategory(options.category || null);
    setShowTaskModal(true);
    console.log('Task modal should now show, showTaskModal:', true);
  };

  // Filter and search tasks
  const getFilteredTasks = () => {
    if (!Array.isArray(tasks)) return [];
    
    let filtered = tasks.filter(task => {
      // Apply category filter
      const currentCategory = categories.find(cat => cat.id === filter);
      
      if (currentCategory) {
        if (currentCategory.isDefault) {
          // Handle default categories
          switch (filter) {
            case 'all':
              return true; // Show all tasks
            case 'completed':
              return task.completed;
            case 'today':
              return isToday(new Date(task.dueDate || task.createdAt));
            case 'work':
            case 'personal':
            case 'important':
              return task.categoryType === filter;
            case 'archived':
              return task.archived;
            default:
              return true;
          }
        } else {
          // Handle custom categories
          return task.category && task.category._id === filter;
        }
      }
      
      return true; // Default to showing all tasks
    });

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query))
      );
    }

    // Sort tasks: incomplete first, then by priority, then by due date
    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority] || 0;
      const bPriority = priorityOrder[b.priority] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      const aDate = new Date(a.dueDate || a.createdAt);
      const bDate = new Date(b.dueDate || b.createdAt);
      return aDate - bDate;
    });
  };

  // Calculate stats
  const getStats = () => {
    if (!Array.isArray(tasks)) return {};
    
    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      today: tasks.filter(t => isToday(new Date(t.dueDate || t.createdAt))).length,
      overdue: tasks.filter(t => !t.completed && t.dueDate && isPast(new Date(t.dueDate))).length
    };

    // Add stats for each category
    categories.forEach(category => {
      if (category.isDefault) {
        switch (category.id) {
          case 'all':
            stats[category.id] = tasks.length;
            break;
          case 'completed':
            stats[category.id] = tasks.filter(t => t.completed).length;
            break;
          case 'today':
            stats[category.id] = tasks.filter(t => isToday(new Date(t.dueDate || t.createdAt))).length;
            break;
          case 'work':
          case 'personal':
          case 'important':
            stats[category.id] = tasks.filter(t => t.categoryType === category.id).length;
            break;
          case 'archived':
            stats[category.id] = tasks.filter(t => t.archived).length;
            break;
        }
      } else {
        // Custom category
        stats[category.id] = tasks.filter(t => t.category && t.category._id === category.id).length;
      }
    });

    stats.completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
    
    return stats;
  };

  // Close modal handler
  const handleCloseModal = () => {
    setShowTaskModal(false);
    setEditingTask(null);
    setInitialCategory(null);
  };

  const filteredTasks = getFilteredTasks();
  const stats = getStats();

  // Handle task category change
  const handleCategoryChange = async (task, category, data) => {
    try {
      // Refresh tasks to get the updated data
      await fetchTasks();
      setError(null);
    } catch (err) {
      setError('Failed to move task to category');
      console.error('Error updating task category:', err);
    }
  };

  useEffect(() => {
    console.log('Dashboard mounted, user:', user);
    console.log('Auth token:', localStorage.getItem('authToken'));
    fetchTasks();
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      
      {/* Top Navigation */}
      <TopNavigation 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Sidebar */}
      <Sidebar 
        isDark={isDark}
        activeFilter={filter}
        onFilterChange={setFilter}
        stats={stats}
      />

      {/* Main Content */}
      <main className="lg:ml-64 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className={`text-3xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            } mb-2`}>
              {(() => {
                const currentCategory = categories.find(cat => cat.id === filter);
                return currentCategory ? currentCategory.name : 'Tasks';
              })()}
            </h1>
            <p className={`text-lg ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg animate-slide-down flex items-center justify-between">
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="ml-2 text-red-700 hover:text-red-900 font-bold"
              >
                ×
              </button>
            </div>
          )}

          {/* Tasks Content */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <TaskCardSkeleton key={i} isDark={isDark} />
              ))}
            </div>
          ) : filteredTasks.length === 0 ? (
            <EmptyState 
              isDark={isDark}
              filter={filter}
              onAddTask={handleAddTask}
            />
          ) : (
            <div className="grid gap-4 md:gap-6">
              {filteredTasks.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  isDark={isDark}
                  onToggle={toggleTask}
                  onEdit={handleEditTask}
                  onDelete={deleteTask}
                  onCategoryChange={handleCategoryChange}
                />
              ))}
            </div>
          )}
        </div>

  

        {/* Floating Action Button */}
        <FloatingActionButton 
          onClick={handleAddTask}
          isDark={isDark}
        />
      </main>

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          task={editingTask}
          isOpen={showTaskModal}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
          isDark={isDark}
          initialCategory={initialCategory}
        />
      )}

      {/* Mobile Navigation */}
      <MobileNavigation isDark={isDark} />
    </div>
  );
};
export default Dashboard;
