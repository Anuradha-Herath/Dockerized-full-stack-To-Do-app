import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import Toast from '../components/Toast';

// Configure axios base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_BASE_URL;

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });
  const { user } = useAuth();

  // Show toast notification
  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  // Hide toast notification
  const hideToast = () => {
    setToast({ show: false, type: 'success', message: '' });
  };

  // Fetch notifications
  const fetchNotifications = useCallback(async (page = 1, limit = 20) => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await axios.get('/api/notifications', {
        params: { page, limit }
      });

      const { notifications: newNotifications, unreadCount: newUnreadCount } = response.data;

      // Validate notifications have valid IDs
      const validNotifications = newNotifications.filter(notification => {
        if (!notification._id) {
          console.warn('Notification missing _id:', notification);
          return false;
        }
        return true;
      });

      if (page === 1) {
        setNotifications(validNotifications);
      } else {
        setNotifications(prev => [...prev, ...validNotifications]);
      }

      setUnreadCount(newUnreadCount);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
      showToast('error', 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Mark notification as read/unread
  const markAsRead = async (notificationId, read = true) => {
    // Validate input
    if (!notificationId) {
      console.error('markAsRead called with invalid ID:', notificationId);
      return null;
    }

    // Check if notification exists in local state
    const existsLocally = notifications.some(n => n._id === notificationId);
    if (!existsLocally) {
      console.warn('Notification not found in local state:', notificationId);
      return null;
    }

    try {
      const response = await axios.put(`/api/notifications/${notificationId}/read`, { read });
      const updatedNotification = response.data;

      setNotifications(prev =>
        prev.map(notification =>
          notification._id === notificationId ? updatedNotification : notification
        )
      );

      // Update unread count
      if (read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        setUnreadCount(prev => prev + 1);
      }

      return updatedNotification;
    } catch (err) {
      console.error('Error updating notification:', err);
      
      // If notification doesn't exist (404), remove it from local state
      if (err.response && err.response.status === 404) {
        console.log('Notification not found on server, removing from local state');
        setNotifications(prev => prev.filter(notification => notification._id !== notificationId));
        return null;
      }
      
      setError('Failed to update notification');
      throw err;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await axios.put('/api/notifications/mark-all-read');
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true, readAt: new Date() }))
      );
      setUnreadCount(0);
      setError(null);
      showToast('success', 'All notifications marked as read');
      return response.data;
    } catch (err) {
      setError('Failed to mark all notifications as read');
      console.error('Error marking all notifications as read:', err);
      showToast('error', 'Failed to mark all notifications as read');
      throw err;
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    // Validate input
    if (!notificationId) {
      console.error('deleteNotification called with invalid ID:', notificationId);
      return false;
    }

    // Check if notification exists in local state
    const existsLocally = notifications.some(n => n._id === notificationId);
    if (!existsLocally) {
      console.warn('Notification not found in local state:', notificationId);
      return true; // Return true since it's already "deleted" from UI perspective
    }

    try {
      await axios.delete(`/api/notifications/${notificationId}`);
      
      // Update local state
      setNotifications(prev => {
        const deletedNotification = prev.find(n => n._id === notificationId);
        if (deletedNotification && !deletedNotification.read) {
          setUnreadCount(prevCount => Math.max(0, prevCount - 1));
        }
        return prev.filter(notification => notification._id !== notificationId);
      });
      
      showToast('success', 'Notification deleted');
      return true;
    } catch (err) {
      console.error('Error deleting notification:', err);
      
      // If notification doesn't exist (404), remove it from local state anyway
      if (err.response && err.response.status === 404) {
        console.log('Notification not found on server, removing from local state');
        setNotifications(prev => {
          const deletedNotification = prev.find(n => n._id === notificationId);
          if (deletedNotification && !deletedNotification.read) {
            setUnreadCount(prevCount => Math.max(0, prevCount - 1));
          }
          return prev.filter(notification => notification._id !== notificationId);
        });
        return true;
      }
      
      setError('Failed to delete notification');
      showToast('error', 'Failed to delete notification');
      throw err;
    }
  };

  // Clean up orphaned notifications
  const cleanupNotifications = async () => {
    try {
      const response = await axios.post('/api/notifications/cleanup');
      console.log('Notification cleanup completed:', response.data);
      return response.data;
    } catch (err) {
      console.error('Error during notification cleanup:', err);
      return null;
    }
  };

  // Get notification statistics
  const getNotificationStats = async () => {
    try {
      const response = await axios.get('/api/notifications/stats');
      return response.data;
    } catch (err) {
      console.error('Error fetching notification stats:', err);
      throw err;
    }
  };

  // Refresh notifications (used after creating new tasks, etc.)
  const refreshNotifications = () => {
    fetchNotifications(1);
  };

  // Auto-refresh notifications every 30 seconds
  useEffect(() => {
    if (user) {
      fetchNotifications();

      const interval = setInterval(() => {
        fetchNotifications(1, 10); // Only fetch recent notifications for auto-refresh
      }, 30000); // 30 seconds

      // Run cleanup once when user logs in
      setTimeout(() => {
        cleanupNotifications();
      }, 2000); // Delay to let initial fetch complete

      return () => clearInterval(interval);
    } else {
      // Clear notifications when user logs out
      setNotifications([]);
      setUnreadCount(0);
      setError(null);
    }
  }, [user, fetchNotifications]);

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    cleanupNotifications,
    getNotificationStats,
    refreshNotifications,
    showToast
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.show}
        onClose={hideToast}
      />
    </NotificationContext.Provider>
  );
};
