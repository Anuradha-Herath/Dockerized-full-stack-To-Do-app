import React, { useState } from 'react';
import { 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  Calendar,
  Flag,
  Clock,
  CheckCircle2,
  Circle
} from 'lucide-react';

const TaskCard = ({ 
  task, 
  isDark, 
  onToggle, 
  onEdit, 
  onDelete,
  onPriorityChange 
}) => {
  const [showMenu, setShowMenu] = useState(false);

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
    <div className={`group relative rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
      task.completed 
        ? isDark 
          ? 'bg-gray-800/50 border-gray-700/50 opacity-75' 
          : 'bg-gray-50/50 border-gray-200/50 opacity-75'
        : isDark 
          ? 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:shadow-xl hover:shadow-primary-500/10' 
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-xl hover:shadow-primary-500/10'
    }`}>
      
      {/* Task Content */}
      <div className="p-6">
        <div className="flex items-start space-x-4">
          
          {/* Checkbox */}
          <button
            onClick={handleToggle}
            className="flex-shrink-0 mt-0.5 transition-all duration-200 hover:scale-110"
          >
            {task.completed ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className={`h-5 w-5 ${
                isDark ? 'text-gray-400 hover:text-primary-400' : 'text-gray-400 hover:text-primary-600'
              }`} />
            )}
          </button>

          {/* Task Details */}
          <div className="flex-1 min-w-0">
            
            {/* Title */}
            <h3 className={`font-medium text-base leading-6 transition-all duration-200 ${
              task.completed 
                ? 'line-through opacity-60' 
                : ''
            } ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {task.title}
            </h3>

            {/* Description */}
            {task.description && (
              <p className={`mt-1 text-sm leading-5 ${
                task.completed ? 'line-through opacity-50' : ''
              } ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {task.description}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex items-center space-x-4 mt-3">
              
              {/* Due Date */}
              {task.dueDate && (
                <div className={`flex items-center space-x-1 text-xs ${
                  isOverdue() 
                    ? 'text-red-500' 
                    : isDark 
                      ? 'text-gray-400' 
                      : 'text-gray-500'
                }`}>
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(task.dueDate)}</span>
                  {isOverdue() && <span className="text-red-500 font-medium">Overdue</span>}
                </div>
              )}

              {/* Priority */}
              {task.priority && (
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                  isDark ? getPriorityColorDark(task.priority) : getPriorityColor(task.priority)
                }`}>
                  <Flag className="h-3 w-3 mr-1" />
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              )}

              {/* Created Date */}
              <div className={`flex items-center space-x-1 text-xs ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}>
                <Clock className="h-3 w-3" />
                <span>
                  {new Date(task.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className={`absolute right-0 top-10 w-36 rounded-lg shadow-lg border z-10 ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              } animate-scale-in`}>
                <div className="py-1">
                  <button
                    onClick={() => {
                      onEdit(task);
                      setShowMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center space-x-2 transition-colors duration-200 ${
                      isDark 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      onDelete(task._id);
                      setShowMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center space-x-2 transition-colors duration-200 ${
                      isDark 
                        ? 'text-red-400 hover:bg-red-900/20' 
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar for subtasks (if applicable) */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className={`px-6 pb-4 ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5`}>
            <div 
              className="bg-primary-600 h-1.5 rounded-full transition-all duration-500"
              style={{ 
                width: `${(task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100}%` 
              }}
            ></div>
          </div>
          <p className={`text-xs mt-1 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {task.subtasks.filter(st => st.completed).length} of {task.subtasks.length} subtasks completed
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
