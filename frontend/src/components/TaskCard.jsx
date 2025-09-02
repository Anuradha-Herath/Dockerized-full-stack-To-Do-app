import React, { useState } from 'react';
import { 
  MoreHorizontal, 
  Trash2, 
  Calendar,
  Flag,
  Clock,
  CheckCircle2,
  Circle,
  FolderOpen,
  Inbox,
  Briefcase,
  User,
  Star,
  Archive,
  CheckCircle,
  Heart,
  Home,
  Book,
  Music,
  Camera,
  Gamepad2,
  Coffee,
  X,
  Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CategorySelector from './CategorySelector';

const TaskCard = ({ 
  task, 
  isDark, 
  onToggle, 
  onEdit, 
  onDelete,
  onPriorityChange,
  onCategoryChange
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false);

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

  const getCategoryDisplay = () => {
    if (task.category && task.category.name) {
      // Custom category
      const IconComponent = iconMap[task.category.icon] || Inbox;
      return {
        name: task.category.name,
        icon: IconComponent,
        color: getColorClass(task.category.color),
        isCustom: true
      };
    } else if (task.categoryType) {
      // Default category
      const categoryMap = {
        all: { name: 'Inbox', icon: Inbox, color: 'text-blue-500' },
        today: { name: 'Today', icon: Calendar, color: 'text-green-500' },
        work: { name: 'Work', icon: Briefcase, color: 'text-purple-500' },
        personal: { name: 'Personal', icon: User, color: 'text-pink-500' },
        important: { name: 'Important', icon: Star, color: 'text-yellow-500' },
        completed: { name: 'Completed', icon: CheckCircle, color: 'text-green-500' },
        archived: { name: 'Archived', icon: Archive, color: 'text-gray-500' }
      };
      const category = categoryMap[task.categoryType] || categoryMap.all;
      return {
        name: category.name,
        icon: category.icon,
        color: category.color,
        isCustom: false
      };
    }
    return {
      name: 'Inbox',
      icon: Inbox,
      color: 'text-blue-500',
      isCustom: false
    };
  };

  const categoryDisplay = getCategoryDisplay();

  const handleCategoryChange = (category, data) => {
    setShowCategorySelector(false);
    onCategoryChange?.(task, category, data);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColorDark = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-900/30 text-red-300 border-red-800';
      case 'medium':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-800';
      case 'low':
        return 'bg-green-900/30 text-green-300 border-green-800';
      default:
        return 'bg-gray-700 text-gray-300 border-gray-600';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const isOverdue = () => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date() && !task.completed;
  };

  const handleToggle = () => {
    onToggle(task._id, !task.completed);
  };

  return (
    <>
      <motion.div 
      className={`group relative rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        task.completed 
          ? isDark 
            ? 'bg-gray-800/50 border-gray-700/50 opacity-75' 
            : 'bg-gray-50/50 border-gray-200/50 opacity-75'
          : isDark 
            ? 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:shadow-xl hover:shadow-primary-500/10' 
            : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-xl hover:shadow-primary-500/10'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      layout
    >
      
      {/* Task Content */}
      <div className="p-6">
        <div className="flex items-start space-x-4">
          
          {/* Checkbox */}
          <motion.button
            onClick={handleToggle}
            className="flex-shrink-0 mt-0.5 transition-all duration-200 hover:scale-110"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {task.completed ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </motion.div>
            ) : (
              <Circle className={`h-5 w-5 ${
                isDark ? 'text-gray-400 hover:text-primary-400' : 'text-gray-400 hover:text-primary-600'
              }`} />
            )}
          </motion.button>

          {/* Task Details */}
          <div className="flex-1 min-w-0">
            
            {/* Title */}
            <motion.h3 
              className={`font-medium text-base leading-6 transition-all duration-200 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
              animate={{ 
                opacity: task.completed ? 0.6 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              <span className={task.completed ? 'line-through' : ''}>
                {task.title}
              </span>
            </motion.h3>

            {/* Description */}
            {task.description && (
              <motion.p 
                className={`mt-1 text-sm leading-5 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
                animate={{ 
                  opacity: task.completed ? 0.5 : 1
                }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <span className={task.completed ? 'line-through' : ''}>
                  {task.description}
                </span>
              </motion.p>
            )}

            {/* Meta Information */}
            <motion.div 
              className="flex items-center space-x-4 mt-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2
                  }
                }
              }}
            >
              
              {/* Category */}
              <motion.button 
                className="flex items-center space-x-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-2 py-1 transition-colors duration-200"
                onClick={() => setShowCategorySelector(true)}
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0 }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {React.createElement(categoryDisplay.icon, {
                  className: `h-4 w-4 ${categoryDisplay.color}`
                })}
                <span className={`text-xs font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {categoryDisplay.name}
                </span>
                {categoryDisplay.isCustom && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                  }`}>
                    Custom
                  </span>
                )}
              </motion.button>
              
              {/* Due Date */}
              {task.dueDate && (
                <motion.button 
                  className={`flex items-center space-x-1 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-2 py-1 transition-colors duration-200 ${
                    isOverdue() 
                      ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' 
                      : isDark 
                        ? 'text-gray-400 hover:bg-gray-700' 
                        : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  onClick={() => setShowDatePicker(true)}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(task.dueDate)}</span>
                  {isOverdue() && <span className="text-red-500 font-medium">Overdue</span>}
                </motion.button>
              )}

              {/* Priority */}
              {task.priority && (
                <motion.button 
                  className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border cursor-pointer transition-all duration-200 ${
                    isDark ? getPriorityColorDark(task.priority) : getPriorityColor(task.priority)
                  } hover:shadow-md`}
                  onClick={() => setShowPriorityModal(true)}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Flag className="h-3 w-3 mr-1" />
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </motion.button>
              )}

              {/* Created Date */}
              <motion.button 
                className={`flex items-center space-x-1 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-2 py-1 transition-colors duration-200 ${
                  isDark ? 'text-gray-500 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100'
                }`}
                onClick={() => onEdit(task)}
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0 }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Clock className="h-3 w-3" />
                <span>
                  {new Date(task.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </motion.button>
            </motion.div>
          </div>

          {/* Actions Menu */}
          <div className="relative">
            <motion.button
              onClick={() => setShowMenu(!showMenu)}
              className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
            >
              <MoreHorizontal className="h-4 w-4" />
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showMenu && (
                <motion.div 
                  className={`absolute right-0 top-10 w-36 rounded-lg shadow-lg border z-10 ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-200'
                  }`}
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className="py-1">
                    <motion.button
                      onClick={() => {
                        onEdit(task);
                        setShowMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center space-x-2 transition-colors duration-200 ${
                        isDark 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      whileHover={{ backgroundColor: isDark ? "#374151" : "#f9fafb" }}
                      transition={{ duration: 0.15 }}
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => {
                        setShowCategorySelector(true);
                        setShowMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center space-x-2 transition-colors duration-200 ${
                        isDark 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      whileHover={{ backgroundColor: isDark ? "#374151" : "#f9fafb" }}
                      transition={{ duration: 0.15 }}
                    >
                      <FolderOpen className="h-4 w-4" />
                      <span>Move to...</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => {
                        onDelete(task._id);
                        setShowMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center space-x-2 transition-colors duration-200 ${
                        isDark 
                          ? 'text-red-400 hover:bg-red-900/20' 
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                      whileHover={{ backgroundColor: isDark ? "#451a1a" : "#fef2f2" }}
                      transition={{ duration: 0.15 }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Progress bar for subtasks (if applicable) */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className={`px-6 pb-4 ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5`}>
            <motion.div 
              className="bg-primary-600 h-1.5 rounded-full transition-all duration-500"
              initial={{ width: 0 }}
              animate={{ 
                width: `${(task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100}%` 
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            ></motion.div>
          </div>
          <p className={`text-xs mt-1 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {task.subtasks.filter(st => st.completed).length} of {task.subtasks.length} subtasks completed
          </p>
        </div>
      )}
    </motion.div>

    {/* Category Selector Modal - Moved outside task card */}
    <CategorySelector
      isOpen={showCategorySelector}
      onClose={() => setShowCategorySelector(false)}
      onSelectCategory={handleCategoryChange}
      selectedTasks={[task]}
      isDark={isDark}
      title="Change Category"
    />

    {/* Date Picker Modal */}
    <AnimatePresence>
      {showDatePicker && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className={`${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-2xl shadow-2xl border max-w-sm w-full p-6`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Change Due Date
              </h3>
              <button
                onClick={() => setShowDatePicker(false)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDark
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Due Date
                </label>
                <input
                  type="date"
                  defaultValue={task.dueDate ? task.dueDate.split('T')[0] : ''}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    onEdit({ ...task, dueDate: newDate ? new Date(newDate).toISOString() : null });
                    setShowDatePicker(false);
                  }}
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none`}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDatePicker(false)}
                  className={`flex-1 px-4 py-2 rounded-lg border transition-all duration-200 ${
                    isDark
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onEdit({ ...task, dueDate: null });
                    setShowDatePicker(false);
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isDark
                      ? 'bg-red-900/50 text-red-300 hover:bg-red-900 border-red-800'
                      : 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200'
                  } border`}
                >
                  Remove Date
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Priority Modal */}
    <AnimatePresence>
      {showPriorityModal && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className={`${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-2xl shadow-2xl border max-w-sm w-full p-6`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Change Priority
              </h3>
              <button
                onClick={() => setShowPriorityModal(false)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDark
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Flag className="w-4 h-4 inline mr-1" />
                  Priority Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'low', label: 'Low', color: isDark ? 'bg-green-900/30 text-green-300 border-green-800' : 'bg-green-100 text-green-800 border-green-200' },
                    { value: 'medium', label: 'Medium', color: isDark ? 'bg-yellow-900/30 text-yellow-300 border-yellow-800' : 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                    { value: 'high', label: 'High', color: isDark ? 'bg-red-900/30 text-red-300 border-red-800' : 'bg-red-100 text-red-800 border-red-200' }
                  ].map(({ value, label, color }) => (
                    <button
                      key={value}
                      onClick={() => {
                        onPriorityChange?.(task, value) || onEdit({ ...task, priority: value });
                        setShowPriorityModal(false);
                      }}
                      className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                        task.priority === value ? color : isDark ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPriorityModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg border transition-all duration-200 ${
                    isDark
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onPriorityChange?.(task, null) || onEdit({ ...task, priority: null });
                    setShowPriorityModal(false);
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200'
                  } border`}
                >
                  Remove Priority
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
);
};

export default TaskCard;
