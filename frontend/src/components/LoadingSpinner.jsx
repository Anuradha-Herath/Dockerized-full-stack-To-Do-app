import React from 'react';

const LoadingSpinner = ({ isDark, size = 'default', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      
      {/* Spinner */}
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} rounded-full border-2 ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}></div>
        
        {/* Inner spinning ring */}
        <div className={`absolute top-0 left-0 ${sizeClasses[size]} rounded-full border-2 border-transparent border-t-primary-600 animate-spin`}></div>
        
        {/* Center dot */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-primary-600 rounded-full animate-pulse`}></div>
      </div>

      {/* Loading message */}
      {message && (
        <p className={`mt-4 text-sm font-medium animate-pulse ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {message}
        </p>
      )}

      {/* Loading dots animation */}
      <div className="flex space-x-1 mt-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-1 h-1 rounded-full animate-bounce ${
              isDark ? 'bg-gray-500' : 'bg-gray-400'
            }`}
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

// Skeleton loader for task cards
export const TaskCardSkeleton = ({ isDark }) => {
  return (
    <div className={`rounded-2xl border p-6 animate-pulse ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-start space-x-4">
        
        {/* Checkbox skeleton */}
        <div className={`w-5 h-5 rounded-full ${
          isDark ? 'bg-gray-700' : 'bg-gray-200'
        }`}></div>

        {/* Content skeleton */}
        <div className="flex-1 space-y-3">
          {/* Title */}
          <div className={`h-4 rounded ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          } w-3/4`}></div>
          
          {/* Description */}
          <div className={`h-3 rounded ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          } w-1/2`}></div>

          {/* Meta info */}
          <div className="flex space-x-4">
            <div className={`h-3 rounded ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            } w-16`}></div>
            <div className={`h-3 rounded ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            } w-20`}></div>
          </div>
        </div>

        {/* Actions skeleton */}
        <div className={`w-8 h-8 rounded ${
          isDark ? 'bg-gray-700' : 'bg-gray-200'
        }`}></div>
      </div>
    </div>
  );
};

// Loading state for full page
export const PageLoading = ({ isDark }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          {/* Large spinner */}
          <div className={`w-16 h-16 rounded-full border-4 ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}></div>
          <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-primary-600 animate-spin"></div>
        </div>
        
        <h2 className={`text-xl font-semibold mb-2 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Loading TaskFlow
        </h2>
        
        <p className={`text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Preparing your workspace...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
