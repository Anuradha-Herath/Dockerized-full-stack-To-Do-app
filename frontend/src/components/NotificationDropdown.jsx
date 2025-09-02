import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, X, Clock, AlertTriangle, CheckCircle, Plus, Edit } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';
import { format, formatDistanceToNow } from 'date-fns';

const NotificationItem = ({ notification, onMarkAsRead, onDelete, isDark }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task_created':
        return <Plus className="h-4 w-4 text-blue-500" />;
      case 'task_completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'task_updated':
        return <Edit className="h-4 w-4 text-orange-500" />;
      case 'task_overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'task_reminder':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <div className={`p-4 border-l-4 ${getPriorityColor(notification.priority)} ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } ${!notification.read ? (isDark ? 'bg-gray-700' : 'bg-gray-50') : ''} hover:${
      isDark ? 'bg-gray-700' : 'bg-gray-50'
    } transition-colors duration-200`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className={`text-sm font-medium ${
              isDark ? 'text-white' : 'text-gray-900'
            } ${!notification.read ? 'font-semibold' : ''}`}>
              {notification.title}
            </p>
            <div className="flex items-center space-x-2">
              {!notification.read && (
                <button
                  onClick={() => onMarkAsRead(notification._id, true)}
                  className={`p-1 rounded-full transition-colors duration-200 ${
                    isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                  }`}
                  title="Mark as read"
                >
                  <Check className="h-3 w-3" />
                </button>
              )}
              <button
                onClick={() => onDelete(notification._id)}
                className={`p-1 rounded-full transition-colors duration-200 ${
                  isDark ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                }`}
                title="Delete notification"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
          <p className={`text-sm ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          } mt-1`}>
            {notification.message}
          </p>
          <div className="flex items-center justify-between mt-2">
            <p className={`text-xs ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </p>
            {notification.relatedTask && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                Task: {notification.relatedTask.title}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationDropdown = ({ isOpen, onClose, isDark }) => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute right-0 mt-2 w-96 rounded-lg shadow-lg border z-50 ${
        isDark
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      } ring-1 ring-black ring-opacity-5 animate-scale-in`}
    >
      {/* Header */}
      <div className={`px-4 py-3 border-b ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-sm font-medium ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {unreadCount}
              </span>
            )}
          </h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className={`text-xs px-2 py-1 rounded transition-colors duration-200 ${
                isDark
                  ? 'text-blue-400 hover:bg-gray-700'
                  : 'text-blue-600 hover:bg-gray-100'
              }`}
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">
            <div className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Loading notifications...
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className={`mx-auto h-8 w-8 ${
              isDark ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <p className={`mt-2 text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              No notifications yet
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
                isDark={isDark}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className={`px-4 py-2 border-t ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={onClose}
            className={`w-full text-center text-sm py-2 rounded transition-colors duration-200 ${
              isDark
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
