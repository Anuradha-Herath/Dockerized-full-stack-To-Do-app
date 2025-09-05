import React, { useState } from 'react';
import { Plus, X, Calendar, Briefcase, User, Star } from 'lucide-react';

const FloatingActionButton = ({ onClick, isDark }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const quickActions = [
    {
      icon: Calendar,
      label: 'Add Today Task',
      action: () => onClick({ category: 'today' }),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: Briefcase,
      label: 'Add Work Task',
      action: () => onClick({ category: 'work' }),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      icon: User,
      label: 'Add Personal Task',
      action: () => onClick({ category: 'personal' }),
      color: 'bg-pink-500 hover:bg-pink-600'
    },
    {
      icon: Star,
      label: 'Add Important Task',
      action: () => onClick({ category: 'important', priority: 'high' }),
      color: 'bg-yellow-500 hover:bg-yellow-600'
    }
  ];

  const handleMainClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Main FAB clicked, isExpanded:', isExpanded);
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      console.log('Calling onClick handler');
      onClick();
    }
  };

  const handleQuickAction = (action) => {
    console.log('Quick action clicked');
    action();
    setIsExpanded(false);
  };

  return (
    <>
      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40 lg:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Floating Action Button Container */}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-[60]"
           style={{ 
             pointerEvents: 'auto',
             position: 'fixed',
             zIndex: 9999 
           }}
      >
        
        {/* Quick Action Buttons */}
        {isExpanded && (
          <div className="mb-4 space-y-3 animate-slide-up">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div
                  key={index}
                  className="flex items-center justify-end"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Label */}
                  <div className={`mr-4 px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap ${
                    isDark 
                      ? 'bg-gray-800 text-white border border-gray-700' 
                      : 'bg-white text-gray-800 border border-gray-200'
                  } opacity-0 animate-fade-in hidden sm:block`}
                    style={{ animationDelay: `${index * 50 + 100}ms` }}
                  >
                    {action.label}
                  </div>
                  
                  {/* Button */}
                  <button
                    onClick={() => handleQuickAction(action.action)}
                    className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 hover:shadow-xl hover:scale-110 ${action.color} opacity-0 animate-fade-in`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    title={action.label}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Main FAB */}
        <div className="relative">
          {/* Main Button */}
          <button
            onClick={handleMainClick}
            className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:scale-110 ${
              isExpanded
                ? 'bg-red-500 hover:bg-red-600 rotate-45'
                : 'bg-primary-600 hover:bg-primary-700'
            } text-white group cursor-pointer`}
            title={isExpanded ? 'Close' : 'Add new task'}
            style={{ 
              pointerEvents: 'auto',
              zIndex: 10000,
              position: 'relative'
            }}
          >
            {isExpanded ? (
              <X className="w-6 h-6 transition-transform duration-300" />
            ) : (
              <Plus className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" />
            )}
          </button>

          {/* Ripple Effect */}
          <div className={`absolute inset-0 rounded-full bg-primary-600 opacity-20 animate-pulse ${
            isExpanded ? 'hidden' : ''
          }`} style={{ animationDuration: '2s' }} />
        </div>

        {/* Secondary Action - Quick Add */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`absolute -top-16 right-0 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:scale-110 ${
            isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-600 hover:bg-gray-500'
          } text-white lg:hidden`}
          title="Quick actions"
        >
          <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            ⚡
          </div>
        </button>
      </div>
    </>
  );
};

export default FloatingActionButton;
