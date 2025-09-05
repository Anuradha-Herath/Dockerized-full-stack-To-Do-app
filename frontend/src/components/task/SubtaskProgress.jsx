import React from 'react';
import { motion } from 'framer-motion';

const SubtaskProgress = ({ task, isDark }) => {
  if (!task.subtasks || task.subtasks.length === 0) {
    return null;
  }

  const completedCount = task.subtasks.filter(st => st.completed).length;
  const totalCount = task.subtasks.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <div className={`px-6 pb-4 ${
      isDark ? 'border-gray-700' : 'border-gray-200'
    }`}>
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5`}>
        <motion.div 
          className="bg-primary-600 h-1.5 rounded-full transition-all duration-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        ></motion.div>
      </div>
      <p className={`text-xs mt-1 ${
        isDark ? 'text-gray-400' : 'text-gray-500'
      }`}>
        {completedCount} of {totalCount} subtasks completed
      </p>
    </div>
  );
};

export default SubtaskProgress;
