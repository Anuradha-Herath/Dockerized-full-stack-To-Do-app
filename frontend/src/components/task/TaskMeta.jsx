import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Flag, Clock } from 'lucide-react';

const TaskMeta = ({ 
  task, 
  isDark, 
  onCategoryClick, 
  onDateClick, 
  onPriorityClick, 
  onEdit,
  categoryDisplay,
  formatDate,
  isOverdue,
  getPriorityColor,
  getPriorityColorDark
}) => {
  return (
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
        onClick={onCategoryClick}
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
          onClick={onDateClick}
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
          onClick={onPriorityClick}
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
      <motion.div 
        className={`flex items-center space-x-1 text-xs px-2 py-1 ${
          isDark ? 'text-gray-500' : 'text-gray-400'
        }`}
        variants={{
          hidden: { opacity: 0, x: -10 },
          visible: { opacity: 1, x: 0 }
        }}
      >
        <Clock className="h-3 w-3" />
        <span>
          {new Date(task.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default TaskMeta;
