import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

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
  const { user } = useAuth();

  // Fetch notifications
  const fetchNotifications = useCallback(async (page = 1, limit = 20) => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await axios.get('/api/notifications', {
        params: { page, limit }
      });

      const { notifications: newNotifications, unreadCount: newUnreadCount } = response.data;

      if (page === 1) {
        setNotifications(newNotifications);
      } else {
        setNotifications(prev => [...prev, ...newNotifications]);
      }

      setUnreadCount(newUnreadCount);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Mark notification as read/unread
  const markAsRead = async (notificationId, read = true) => {
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
      setError('Failed to update notification');
      console.error('Error updating notification:', err);
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
      return response.data;
    } catch (err) {
      setError('Failed to mark all notifications as read');
      console.error('Error marking all notifications as read:', err);
      throw err;
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`/api/notifications/${notificationId}`);
      setNotifications(prev => prev.filter(notification => notification._id !== notificationId));
      return true;
    } catch (err) {
      setError('Failed to delete notification');
      console.error('Error deleting notification:', err);
      throw err;
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

      return () => clearInterval(interval);
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
    getNotificationStats,
    refreshNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
