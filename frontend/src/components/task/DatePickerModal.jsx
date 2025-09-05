import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, X } from 'lucide-react';

const DatePickerModal = ({ 
  isOpen, 
  onClose, 
  task, 
  onEdit, 
  isDark 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
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
                onClick={onClose}
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
                    onClose();
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
                  onClick={onClose}
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
                    onClose();
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
  );
};

export default DatePickerModal;
