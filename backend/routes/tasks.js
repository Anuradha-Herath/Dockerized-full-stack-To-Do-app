const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const {
  taskValidation,
  updateTaskValidation,
  handleValidationErrors
} = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get all tasks for authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    console.log('📋 Fetching tasks for user:', req.user._id);
    
    const { 
      completed, 
      priority, 
      category, 
      dueDate, 
      page = 1, 
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = { user: req.user._id };
    console.log('🔍 Filter being used:', filter);

    // Apply filters
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }
    if (priority) {
      filter.priority = priority;
    }
    if (category) {
      filter.category = category;
    }
    if (dueDate) {
      const date = new Date(dueDate);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      filter.dueDate = {
        $gte: date,
        $lt: nextDay
      };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const tasks = await Task.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const totalTasks = await Task.countDocuments(filter);
    const totalPages = Math.ceil(totalTasks / limitNum);

    console.log(`📊 Found ${tasks.length} tasks for user ${req.user._id}`);
    console.log('📋 Tasks found:', tasks.map(t => ({ id: t._id, title: t.title, user: t.user })));

    res.json({
      tasks,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalTasks,
        hasMore: pageNum < totalPages
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Server error while fetching tasks' });
  }
});

// @route   GET /api/tasks/stats
// @desc    Get task statistics for dashboard
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const stats = await Promise.all([
      // Total tasks
      Task.countDocuments({ user: userId }),
      
      // Completed tasks
      Task.countDocuments({ user: userId, completed: true }),
      
      // Today's tasks
      Task.countDocuments({
        user: userId,
        $or: [
          { dueDate: { $gte: today, $lt: tomorrow } },
          { createdAt: { $gte: today, $lt: tomorrow } }
        ]
      }),
      
      // Overdue tasks
      Task.countDocuments({
        user: userId,
        completed: false,
        dueDate: { $lt: today }
      }),
      
      // This week's tasks
      (() => {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);
        
        return Task.countDocuments({
          user: userId,
          $or: [
            { dueDate: { $gte: weekStart, $lt: weekEnd } },
            { createdAt: { $gte: weekStart, $lt: weekEnd } }
          ]
        });
      })(),
      
      // Priority breakdown
      Task.aggregate([
        { $match: { user: userId, completed: false } },
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ])
    ]);

    const [total, completed, today_count, overdue, thisWeek, priorityBreakdown] = stats;

    const priorityStats = priorityBreakdown.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, { low: 0, medium: 0, high: 0 });

    res.json({
      total,
      completed,
      today: today_count,
      overdue,
      thisWeek,
      priority: priorityStats,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error while fetching statistics' });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Server error while fetching task' });
  }
});

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private
router.post('/', auth, taskValidation, handleValidationErrors, async (req, res) => {
  try {
    const { title, description, priority, dueDate, category, tags } = req.body;

    console.log('➕ Creating task for user:', req.user._id);
    console.log('📝 Task data:', { title, description, priority, dueDate, category });

    const task = new Task({
      title,
      description,
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      category: category || 'personal',
      tags: tags || [],
      user: req.user._id
    });

    await task.save();
    console.log('✅ Task created successfully:', { id: task._id, title: task.title, user: task.user });
    
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Server error while creating task' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', auth, updateTaskValidation, handleValidationErrors, async (req, res) => {
  try {
    const updates = req.body;
    
    // Handle dueDate conversion
    if (updates.dueDate) {
      updates.dueDate = new Date(updates.dueDate);
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Server error while updating task' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Server error while deleting task' });
  }
});

// @route   POST /api/tasks/bulk-update
// @desc    Bulk update tasks (mark multiple as completed, etc.)
// @access  Private
router.post('/bulk-update', auth, async (req, res) => {
  try {
    const { taskIds, updates } = req.body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ error: 'Task IDs array is required' });
    }

    const result = await Task.updateMany(
      { 
        _id: { $in: taskIds },
        user: req.user._id
      },
      updates,
      { runValidators: true }
    );

    res.json({
      message: `${result.modifiedCount} tasks updated successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ error: 'Server error during bulk update' });
  }
});

// @route   DELETE /api/tasks/bulk-delete
// @desc    Bulk delete tasks
// @access  Private
router.delete('/bulk-delete', auth, async (req, res) => {
  try {
    const { taskIds } = req.body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ error: 'Task IDs array is required' });
    }

    const result = await Task.deleteMany({
      _id: { $in: taskIds },
      user: req.user._id
    });

    res.json({
      message: `${result.deletedCount} tasks deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ error: 'Server error during bulk delete' });
  }
});

module.exports = router;
