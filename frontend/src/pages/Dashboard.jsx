import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Edit3,
  Moon,
  Sun,
  LogOut,
  User,
  Settings,
  Target,
  TrendingUp
} from 'lucide-react';
import { format, isToday, isThisWeek, isPast } from 'date-fns';
import axios from 'axios';
import TaskModal from '../components/TaskModal';
import ProgressBar from '../components/ProgressBar';
import MobileNavigation from '../components/MobileNavigation';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, today, week, completed
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/tasks');
      console.log('📋 Frontend received tasks response:', response.data);
      
      // Handle both array response and object with tasks property
      const tasksData = Array.isArray(response.data) 
        ? response.data 
        : Array.isArray(response.data.tasks) 
          ? response.data.tasks 
          : [];
          
      setTasks(tasksData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
      setTasks([]); // Set empty array on error
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Quick add task
  const quickAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      const response = await axios.post('/api/tasks', {
        title: newTaskTitle.trim(),
        description: '',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0]
      });
      setTasks(prev => [response.data, ...prev]);
      setNewTaskTitle('');
      setError(null);
    } catch (err) {
      setError('Failed to add task');
      console.error('Error adding task:', err);
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

  // Filter tasks
  const filteredTasks = Array.isArray(tasks) ? tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'today') return isToday(new Date(task.dueDate || task.createdAt));
    if (filter === 'week') return isThisWeek(new Date(task.dueDate || task.createdAt));
    return true;
  }) : [];

  // Calculate stats
  const stats = {
    total: Array.isArray(tasks) ? tasks.length : 0,
    completed: Array.isArray(tasks) ? tasks.filter(t => t.completed).length : 0,
    today: Array.isArray(tasks) ? tasks.filter(t => isToday(new Date(t.dueDate || t.createdAt))).length : 0,
    overdue: Array.isArray(tasks) ? tasks.filter(t => !t.completed && t.dueDate && isPast(new Date(t.dueDate))).length : 0
  };

  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      quickAddTask();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'low': return 'bg-secondary-100 text-secondary-800 border-secondary-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className={`text-xl font-bold ${
                  isDark ? 'text-white' : 'text-text-primary'
                }`}>
                  📝 TodoMaster
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDark 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => navigate('/profile')}
                className={`hidden md:flex items-center px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                  isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <User className="w-4 h-4 mr-2" />
                {user?.email}
              </button>
              
              <button
                onClick={logout}
                className={`hidden md:block p-2 rounded-lg transition-colors duration-200 ${
                  isDark 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`${
            isDark ? 'bg-gray-800' : 'bg-surface'
          } rounded-xl p-6 shadow-sm border ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          } transition-all duration-200 hover:shadow-md`}>
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-text-secondary'
                }`}>Total Tasks</p>
                <p className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-text-primary'
                }`}>{stats.total}</p>
              </div>
            </div>
          </div>

          <div className={`${
            isDark ? 'bg-gray-800' : 'bg-surface'
          } rounded-xl p-6 shadow-sm border ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          } transition-all duration-200 hover:shadow-md`}>
            <div className="flex items-center">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-text-secondary'
                }`}>Completed</p>
                <p className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-text-primary'
                }`}>{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className={`${
            isDark ? 'bg-gray-800' : 'bg-surface'
          } rounded-xl p-6 shadow-sm border ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          } transition-all duration-200 hover:shadow-md`}>
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-text-secondary'
                }`}>Today</p>
                <p className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-text-primary'
                }`}>{stats.today}</p>
              </div>
            </div>
          </div>

          <div className={`${
            isDark ? 'bg-gray-800' : 'bg-surface'
          } rounded-xl p-6 shadow-sm border ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          } transition-all duration-200 hover:shadow-md`}>
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-text-secondary'
                }`}>Overdue</p>
                <p className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-text-primary'
                }`}>{stats.overdue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar 
          percentage={completionRate} 
          isDark={isDark}
          className="mb-8"
        />

        {/* Quick Add & Filters */}
        <div className={`${
          isDark ? 'bg-gray-800' : 'bg-surface'
        } rounded-xl p-6 shadow-sm border ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        } mb-8`}>
          
          {/* Quick Add */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a new task..."
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-primary-500'
                    : 'bg-white border-gray-300 text-text-primary placeholder-gray-500 focus:border-primary-500'
                } focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 focus:outline-none`}
              />
            </div>
            <button
              onClick={quickAddTask}
              disabled={!newTaskTitle.trim()}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowTaskModal(true)}
              className={`px-6 py-3 rounded-lg border transition-all duration-200 ${
                isDark
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              } hover:shadow-md`}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Tasks', icon: Target },
              { key: 'today', label: 'Today', icon: Calendar },
              { key: 'week', label: 'This Week', icon: TrendingUp },
              { key: 'completed', label: 'Completed', icon: CheckCircle2 }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === key
                    ? 'bg-primary-600 text-white'
                    : isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg animate-slide-down">
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-2 text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        {/* Tasks List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className={`text-center py-12 ${
            isDark ? 'bg-gray-800' : 'bg-surface'
          } rounded-xl shadow-sm border ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="mb-4">
              <CheckCircle2 className={`w-16 h-16 mx-auto ${
                isDark ? 'text-gray-600' : 'text-gray-400'
              }`} />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${
              isDark ? 'text-white' : 'text-text-primary'
            }`}>
              {filter === 'completed' ? '🎉 No completed tasks yet!' : 
               filter === 'today' ? '📅 No tasks for today!' :
               filter === 'week' ? '📊 No tasks this week!' : 
               '🚀 No tasks yet!'}
            </h3>
            <p className={`${
              isDark ? 'text-gray-400' : 'text-text-secondary'
            }`}>
              {filter === 'all' ? 'Add your first task above to get started!' : 
               `Switch to "All Tasks" to see your complete list.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map(task => (
              <div
                key={task._id}
                className={`${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-surface border-gray-200'
                } rounded-xl p-6 border transition-all duration-200 hover:shadow-md ${
                  task.completed ? 'opacity-75' : ''
                } animate-slide-up`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleTask(task._id, !task.completed)}
                    className={`mt-1 p-1 rounded-full transition-colors duration-200 ${
                      task.completed
                        ? 'text-secondary-600 hover:text-secondary-700'
                        : isDark
                          ? 'text-gray-400 hover:text-secondary-500'
                          : 'text-gray-400 hover:text-secondary-500'
                    }`}
                  >
                    <CheckCircle2 className={`w-6 h-6 ${
                      task.completed ? 'fill-current' : ''
                    }`} />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold ${
                          isDark ? 'text-white' : 'text-text-primary'
                        } ${task.completed ? 'line-through' : ''} mb-1`}>
                          {task.title}
                        </h3>
                        
                        {task.description && (
                          <p className={`${
                            isDark ? 'text-gray-300' : 'text-text-secondary'
                          } mb-3`}>
                            {task.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          {task.priority && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                              getPriorityColor(task.priority)
                            }`}>
                              {task.priority} priority
                            </span>
                          )}
                          
                          {task.dueDate && (
                            <span className={`flex items-center ${
                              isDark ? 'text-gray-400' : 'text-text-secondary'
                            }`}>
                              <Calendar className="w-4 h-4 mr-1" />
                              {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                            </span>
                          )}

                          <span className={`${
                            isDark ? 'text-gray-400' : 'text-text-secondary'
                          }`}>
                            Created {format(new Date(task.createdAt), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => {
                            setEditingTask(task);
                            setShowTaskModal(true);
                          }}
                          className={`p-2 rounded-lg transition-colors duration-200 ${
                            isDark
                              ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700'
                              : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
                          }`}
                          title="Edit task"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => deleteTask(task._id)}
                          className={`p-2 rounded-lg transition-colors duration-200 ${
                            isDark
                              ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700'
                              : 'text-gray-500 hover:text-red-600 hover:bg-gray-100'
                          }`}
                          title="Delete task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          task={editingTask}
          isOpen={showTaskModal}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          onSave={(taskData) => {
            if (editingTask) {
              // Update existing task
              axios.put(`/api/tasks/${editingTask._id}`, taskData)
                .then(response => {
                  setTasks(prev => 
                    prev.map(task => 
                      task._id === editingTask._id ? response.data : task
                    )
                  );
                })
                .catch(err => setError('Failed to update task'));
            } else {
              // Create new task
              axios.post('/api/tasks', taskData)
                .then(response => {
                  setTasks(prev => [response.data, ...prev]);
                })
                .catch(err => setError('Failed to create task'));
            }
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          isDark={isDark}
        />
      )}

      {/* Mobile Navigation */}
      <MobileNavigation isDark={isDark} />
    </div>
  );
};

export default Dashboard;
