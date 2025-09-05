const Notification = require('../models/Notification');
const Task = require('../models/Task');
const User = require('../models/User');

class NotificationService {
  // Create notification for task creation
  static async createTaskCreatedNotification(task, userId) {
    try {
      const notification = new Notification({
        title: 'New Task Created',
        message: `Task "${task.title}" has been created`,
        type: 'task_created',
        priority: task.priority,
        user: userId,
        relatedTask: task._id,
        metadata: {
          taskTitle: task.title,
          taskPriority: task.priority,
          taskDueDate: task.dueDate
        }
      });

      await notification.save();
      return notification;
    } catch (error) {
      console.error('Error creating task created notification:', error);
    }
  }

  // Create notification for task completion
  static async createTaskCompletedNotification(task, userId) {
    try {
      const notification = new Notification({
        title: 'Task Completed',
        message: `Task "${task.title}" has been completed`,
        type: 'task_completed',
        priority: 'low',
        user: userId,
        relatedTask: task._id,
        metadata: {
          taskTitle: task.title,
          completedAt: task.completedAt
        }
      });

      await notification.save();
      return notification;
    } catch (error) {
      console.error('Error creating task completed notification:', error);
    }
  }

  // Create notification for task updates
  static async createTaskUpdatedNotification(task, userId, changes = {}) {
    try {
      let message = `Task "${task.title}" has been updated`;

      if (changes.dueDate) {
        message = `Due date for "${task.title}" has been ${changes.dueDate.old ? 'changed' : 'set'}`;
      } else if (changes.priority) {
        message = `Priority for "${task.title}" has been changed to ${task.priority}`;
      }

      const notification = new Notification({
        title: 'Task Updated',
        message,
        type: 'task_updated',
        priority: task.priority,
        user: userId,
        relatedTask: task._id,
        metadata: {
          taskTitle: task.title,
          changes: changes
        }
      });

      await notification.save();
      return notification;
    } catch (error) {
      console.error('Error creating task updated notification:', error);
    }
  }

  // Create notification for overdue tasks
  static async createOverdueTaskNotification(task, userId) {
    try {
      const notification = new Notification({
        title: 'Task Overdue',
        message: `Task "${task.title}" is overdue`,
        type: 'task_overdue',
        priority: 'high',
        user: userId,
        relatedTask: task._id,
        metadata: {
          taskTitle: task.title,
          dueDate: task.dueDate,
          daysOverdue: Math.floor((new Date() - new Date(task.dueDate)) / (1000 * 60 * 60 * 24))
        }
      });

      await notification.save();
      return notification;
    } catch (error) {
      console.error('Error creating overdue task notification:', error);
    }
  }

  // Create notification for upcoming due dates (reminder)
  static async createTaskReminderNotification(task, userId, hoursUntilDue) {
    try {
      const notification = new Notification({
        title: 'Task Due Soon',
        message: `Task "${task.title}" is due in ${hoursUntilDue} hour${hoursUntilDue > 1 ? 's' : ''}`,
        type: 'task_reminder',
        priority: task.priority === 'high' ? 'high' : 'medium',
        user: userId,
        relatedTask: task._id,
        metadata: {
          taskTitle: task.title,
          dueDate: task.dueDate,
          hoursUntilDue
        }
      });

      await notification.save();
      return notification;
    } catch (error) {
      console.error('Error creating task reminder notification:', error);
    }
  }

  // Check for overdue tasks and create notifications
  static async checkAndCreateOverdueNotifications() {
    try {
      const now = new Date();
      const overdueTasks = await Task.find({
        completed: false,
        dueDate: { $lt: now }
      }).populate('user', 'email name');

      for (const task of overdueTasks) {
        // Check if notification already exists for this overdue task
        const existingNotification = await Notification.findOne({
          user: task.user._id,
          relatedTask: task._id,
          type: 'task_overdue',
          createdAt: {
            $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) // Within last 24 hours
          }
        });

        if (!existingNotification) {
          await this.createOverdueTaskNotification(task, task.user._id);
        }
      }

      console.log(`Checked ${overdueTasks.length} overdue tasks for notifications`);
    } catch (error) {
      console.error('Error checking overdue tasks:', error);
    }
  }

  // Check for upcoming due dates and create reminder notifications
  static async checkAndCreateReminderNotifications() {
    try {
      const now = new Date();
      const reminderHours = [24, 12, 6, 1]; // Hours before due date to send reminders

      for (const hours of reminderHours) {
        const reminderTime = new Date(now.getTime() + hours * 60 * 60 * 1000);

        const upcomingTasks = await Task.find({
          completed: false,
          dueDate: {
            $gte: now,
            $lte: reminderTime
          }
        }).populate('user', 'email name');

        for (const task of upcomingTasks) {
          // Check if reminder notification already exists
          const existingNotification = await Notification.findOne({
            user: task.user._id,
            relatedTask: task._id,
            type: 'task_reminder',
            createdAt: {
              $gte: new Date(now.getTime() - 2 * 60 * 60 * 1000) // Within last 2 hours
            }
          });

          if (!existingNotification) {
            await this.createTaskReminderNotification(task, task.user._id, hours);
          }
        }
      }

      console.log('Checked upcoming tasks for reminder notifications');
    } catch (error) {
      console.error('Error checking reminder tasks:', error);
    }
  }

  // Clean up old notifications (keep only last 30 days)
  static async cleanupOldNotifications() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await Notification.deleteMany({
        createdAt: { $lt: thirtyDaysAgo },
        read: true // Only delete read notifications
      });

      console.log(`Cleaned up ${result.deletedCount} old notifications`);
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
    }
  }
}

module.exports = NotificationService;
