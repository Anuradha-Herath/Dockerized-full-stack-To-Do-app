import React, { useState } from 'react';
import { 
  MoreHorizontal,
  CheckCircle2,
  Circle,
  Calendar,
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
  Coffee
} from 'lucide-react';
import { motion } from 'framer-motion';
import CategorySelector from '../CategorySelector';
import TaskMenu from './TaskMenu';
import DatePickerModal from './DatePickerModal';
import PriorityModal from './PriorityModal';
import TaskMeta from './TaskMeta';
import SubtaskProgress from './SubtaskProgress';

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
            <TaskMeta
              task={task}
              isDark={isDark}
              onCategoryClick={() => setShowCategorySelector(true)}
              onDateClick={() => setShowDatePicker(true)}
              onPriorityClick={() => setShowPriorityModal(true)}
              onEdit={onEdit}
              categoryDisplay={categoryDisplay}
              formatDate={formatDate}
              isOverdue={isOverdue}
              getPriorityColor={getPriorityColor}
              getPriorityColorDark={getPriorityColorDark}
            />
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

            <TaskMenu
              isOpen={showMenu}
              onClose={() => setShowMenu(false)}
              onEdit={() => onEdit(task)}
              onMoveTo={() => setShowCategorySelector(true)}
              onDelete={() => onDelete(task._id)}
              isDark={isDark}
            />
          </div>
        </div>
      </div>

      {/* Progress bar for subtasks (if applicable) */}
      <SubtaskProgress task={task} isDark={isDark} />
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
    <DatePickerModal
      isOpen={showDatePicker}
      onClose={() => setShowDatePicker(false)}
      task={task}
      onEdit={onEdit}
      isDark={isDark}
    />

    {/* Priority Modal */}
    <PriorityModal
      isOpen={showPriorityModal}
      onClose={() => setShowPriorityModal(false)}
      task={task}
      onPriorityChange={onPriorityChange}
      onEdit={onEdit}
      isDark={isDark}
    />
  </>
);
};

export default TaskCard;
