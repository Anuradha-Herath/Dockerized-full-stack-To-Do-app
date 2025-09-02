const express = require('express');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get all notifications for authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      read,
      type,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = { user: req.user._id };

    // Apply filters
    if (read !== undefined) {
      filter.read = read === 'true';
    }
    if (type) {
      filter.type = type;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const notifications = await Notification.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate('relatedTask', 'title priority dueDate completed')
      .populate('relatedCategory', 'name color icon')
      .lean();

    const totalNotifications = await Notification.countDocuments(filter);
    const totalPages = Math.ceil(totalNotifications / limitNum);

    // Get unread count
    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      read: false
    });

    res.json({
      notifications,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalNotifications,
        hasMore: pageNum < totalPages
      },
      unreadCount
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Server error while fetching notifications' });
  }
});

// @route   GET /api/notifications/stats
// @desc    Get notification statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Promise.all([
      // Total notifications
      Notification.countDocuments({ user: userId }),

      // Unread notifications
      Notification.countDocuments({ user: userId, read: false }),

      // Today's notifications
      Notification.countDocuments({
        user: userId,
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }),

      // This week's notifications
      (() => {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);

        return Notification.countDocuments({
          user: userId,
          createdAt: { $gte: weekStart, $lt: weekEnd }
        });
      })(),

      // Notifications by type
      Notification.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ])
    ]);

    const [total, unread, today, thisWeek, typeBreakdown] = stats;

    const typeStats = typeBreakdown.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json({
      total,
      unread,
      today,
      thisWeek,
      byType: typeStats
    });
  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({ error: 'Server error while fetching notification statistics' });
  }
});

// @route   GET /api/notifications/:id
// @desc    Get single notification
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('relatedTask', 'title priority dueDate completed')
      .populate('relatedCategory', 'name color icon');

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Get notification error:', error);
    res.status(500).json({ error: 'Server error while fetching notification' });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read/unread
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    const { read = true } = req.body;

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read },
      { new: true }
    ).populate('relatedTask', 'title priority dueDate completed')
      .populate('relatedCategory', 'name color icon');

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Update notification read status error:', error);
    res.status(500).json({ error: 'Server error while updating notification' });
  }
});

// @route   PUT /api/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Private
router.put('/mark-all-read', auth, async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );

    res.json({
      message: `${result.modifiedCount} notifications marked as read`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ error: 'Server error while marking notifications as read' });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Server error while deleting notification' });
  }
});

// @route   DELETE /api/notifications/bulk-delete
// @desc    Bulk delete notifications
// @access  Private
router.delete('/bulk-delete', auth, async (req, res) => {
  try {
    const { notificationIds } = req.body;

    if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).json({ error: 'Notification IDs array is required' });
    }

    const result = await Notification.deleteMany({
      _id: { $in: notificationIds },
      user: req.user._id
    });

    res.json({
      message: `${result.deletedCount} notifications deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Bulk delete notifications error:', error);
    res.status(500).json({ error: 'Server error during bulk delete' });
  }
});

module.exports = router;
