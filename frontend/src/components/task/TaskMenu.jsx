import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, FolderOpen, Trash2 } from 'lucide-react';

const TaskMenu = ({ 
  isOpen, 
  onClose, 
  onEdit, 
  onMoveTo, 
  onDelete, 
  isDark 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={`absolute right-0 top-10 w-36 rounded-lg shadow-lg border z-[9999] ${
            isDark 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}
          role="menu"
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="py-1">
            <motion.button
              onClick={() => {
                onEdit();
                onClose();
              }}
              className={`w-full text-left px-3 py-2 text-sm flex items-center space-x-2 transition-colors duration-200 ${
                isDark 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              whileHover={{ backgroundColor: isDark ? "#374151" : "#f9fafb" }}
              transition={{ duration: 0.15 }}
              role="menuitem"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </motion.button>
            
            <motion.button
              onClick={() => {
                onMoveTo();
                onClose();
              }}
              className={`w-full text-left px-3 py-2 text-sm flex items-center space-x-2 transition-colors duration-200 ${
                isDark 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              whileHover={{ backgroundColor: isDark ? "#374151" : "#f9fafb" }}
              transition={{ duration: 0.15 }}
              role="menuitem"
            >
              <FolderOpen className="h-4 w-4" />
              <span>Move to...</span>
            </motion.button>
            
            <motion.button
              onClick={() => {
                onDelete();
                onClose();
              }}
              className={`w-full text-left px-3 py-2 text-sm flex items-center space-x-2 transition-colors duration-200 ${
                isDark 
                  ? 'text-red-400 hover:bg-red-900/20' 
                  : 'text-red-600 hover:bg-red-50'
              }`}
              whileHover={{ backgroundColor: isDark ? "#451a1a" : "#fef2f2" }}
              transition={{ duration: 0.15 }}
              role="menuitem"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskMenu;
