import React from 'react';
import { TrendingUp } from 'lucide-react';

const ProgressBar = ({ percentage, isDark, className = '' }) => {
  const getMotivationalMessage = (percentage) => {
    if (percentage === 0) return "Let's get started! 🚀";
    if (percentage < 25) return "Great start! Keep going! 💪";
    if (percentage < 50) return "You're making progress! 📈";
    if (percentage < 75) return "More than halfway there! 🔥";
    if (percentage < 100) return "Almost there! You got this! ⭐";
    return "Perfect! All tasks completed! 🎉";
  };

  const getProgressColor = (percentage) => {
    if (percentage < 25) return 'bg-red-500';
    if (percentage < 50) return 'bg-warning-500';
    if (percentage < 75) return 'bg-blue-500';
    return 'bg-secondary-500';
  };

  return (
    <div className={`${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-surface border-gray-200'
    } rounded-xl p-6 shadow-sm border ${className}`}>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-primary-100 rounded-lg mr-3">
            <TrendingUp className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${
              isDark ? 'text-white' : 'text-text-primary'
            }`}>
              Today's Progress
            </h3>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-text-secondary'
            }`}>
              {getMotivationalMessage(percentage)}
            </p>
          </div>
        </div>
        
        <div className={`text-2xl font-bold ${
          isDark ? 'text-white' : 'text-text-primary'
        }`}>
          {Math.round(percentage)}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className={`w-full h-3 rounded-full ${
        isDark ? 'bg-gray-700' : 'bg-gray-200'
      } overflow-hidden`}>
        <div
          className={`h-full transition-all duration-500 ease-out ${getProgressColor(percentage)} rounded-full relative`}
          style={{ width: `${percentage}%` }}
        >
          {/* Animated shimmer effect */}
          {percentage > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Progress markers */}
      <div className="flex justify-between mt-2 text-xs">
        {[0, 25, 50, 75, 100].map((marker) => (
          <span
            key={marker}
            className={`${
              percentage >= marker
                ? isDark ? 'text-white' : 'text-text-primary'
                : isDark ? 'text-gray-600' : 'text-gray-400'
            } font-medium transition-colors duration-300`}
          >
            {marker}%
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
