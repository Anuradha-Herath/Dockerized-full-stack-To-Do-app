const express = require('express');
const Task = require('../models/Task');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const NotificationService = require('../services/NotificationService');
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
      categoryType,
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
      // Handle both ObjectId and string categories
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.category = category;
      } else {
        filter.categoryType = category;
      }
    }
    if (categoryType) {
      filter.categoryType = categoryType;
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

    // Find tasks first without population to handle legacy data
    let tasks = await Task.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Handle legacy tasks and populate only valid ObjectId categories
    const processedTasks = await Promise.all(tasks.map(async (task) => {
      // Handle legacy category data
      if (!task.categoryType) {
        if (typeof task.category === 'string') {
          task.categoryType = task.category;
          task.category = null;
        } else {
          task.categoryType = 'all';
        }
      }

      // If category is a valid ObjectId, populate it
      if (task.category && mongoose.Types.ObjectId.isValid(task.category)) {
        try {
          const category = await Category.findById(task.category).select('name color icon').lean();
          if (category) {
            task.category = category;
          } else {
            task.category = null;
          }
        } catch (error) {
          console.log('Error populating category:', error);
          task.category = null;
        }
      } else {
        task.category = null;
      }

      return task;
    }));

    const totalTasks = await Task.countDocuments(filter);
    const totalPages = Math.ceil(totalTasks / limitNum);

    console.log(`📊 Found ${processedTasks.length} tasks for user ${req.user._id}`);
    console.log('📋 Tasks found:', processedTasks.map(t => ({ id: t._id, title: t.title, user: t.user })));

    res.json({
      tasks: processedTasks,
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
    const { title, description, priority, dueDate, category, categoryType, tags } = req.body;

    console.log('➕ Creating task for user:', req.user._id);
    console.log('📝 Task data received:', req.body);
    console.log('📝 Parsed task data:', { title, description, priority, dueDate, category, categoryType });

    // Determine category assignment
    let taskCategory = null;
    let taskCategoryType = categoryType || 'all';

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        // It's a custom category
        const categoryExists = await Category.findById(category);
        if (categoryExists && categoryExists.user.toString() === req.user._id.toString()) {
          taskCategory = category;
          taskCategoryType = 'custom';
        } else {
          console.log('❌ Category not found or not owned by user:', category);
        }
      } else {
        // It's a default category type
        taskCategoryType = category;
        taskCategory = null;
      }
    }

    const task = new Task({
      title,
      description,
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      category: taskCategory,
      categoryType: taskCategoryType,
      tags: tags || [],
      user: req.user._id
    });

    console.log('💾 Saving task with data:', {
      title: task.title,
      category: task.category,
      categoryType: task.categoryType,
      user: task.user
    });

    await task.save();
    
    // Populate category info before sending response
    await task.populate('category', 'name color icon');
    
    // Create notification for task creation
    await NotificationService.createTaskCreatedNotification(task, req.user._id);
    
    console.log('✅ Task created successfully:', { id: task._id, title: task.title, user: task.user });
    
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    res.status(500).json({ error: 'Server error while creating task' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', auth, updateTaskValidation, handleValidationErrors, async (req, res) => {
  try {
    const updates = req.body;
    
    // Get the original task to track changes
    const originalTask = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!originalTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Handle dueDate conversion
    if (updates.dueDate) {
      updates.dueDate = new Date(updates.dueDate);
    }

    // Handle category assignment
    if (updates.category !== undefined) {
      if (mongoose.Types.ObjectId.isValid(updates.category)) {
        // It's a custom category
        const categoryExists = await Category.findById(updates.category);
        if (categoryExists && categoryExists.user.toString() === req.user._id.toString()) {
          updates.category = updates.category;
          updates.categoryType = 'custom';
        } else {
          return res.status(400).json({ error: 'Invalid category' });
        }
      } else {
        // It's a default category type
        updates.category = null;
        updates.categoryType = updates.category;
      }
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    ).populate('category', 'name color icon');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Create notifications based on changes
    const changes = {};

    // Check for completion status change
    if (updates.completed !== undefined && updates.completed !== originalTask.completed) {
      if (updates.completed) {
        await NotificationService.createTaskCompletedNotification(task, req.user._id);
      }
    }

    // Check for due date change
    if (updates.dueDate && (!originalTask.dueDate || updates.dueDate.getTime() !== originalTask.dueDate.getTime())) {
      changes.dueDate = {
        old: originalTask.dueDate,
        new: updates.dueDate
      };
    }

    // Check for priority change
    if (updates.priority && updates.priority !== originalTask.priority) {
      changes.priority = {
        old: originalTask.priority,
        new: updates.priority
      };
    }

    // Create update notification if there are changes
    if (Object.keys(changes).length > 0) {
      await NotificationService.createTaskUpdatedNotification(task, req.user._id, changes);
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

    // Handle category assignment in bulk updates
    if (updates.category !== undefined) {
      if (mongoose.Types.ObjectId.isValid(updates.category)) {
        // It's a custom category
        const categoryExists = await Category.findById(updates.category);
        if (categoryExists && categoryExists.user.toString() === req.user._id.toString()) {
          updates.categoryType = 'custom';
        } else {
          return res.status(400).json({ error: 'Invalid category' });
        }
      } else {
        // It's a default category type
        updates.categoryType = updates.category;
        updates.category = null;
      }
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

// @route   POST /api/tasks/move-to-category
// @desc    Move tasks to a specific category
// @access  Private
router.post('/move-to-category', auth, async (req, res) => {
  try {
    const { taskIds, categoryId, categoryType } = req.body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ error: 'Task IDs array is required' });
    }

    let updateData = {};

    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      // Moving to custom category
      const categoryExists = await Category.findById(categoryId);
      if (!categoryExists || categoryExists.user.toString() !== req.user._id.toString()) {
        return res.status(400).json({ error: 'Invalid category' });
      }
      updateData.category = categoryId;
      updateData.categoryType = 'custom';
    } else if (categoryType) {
      // Moving to default category
      updateData.category = null;
      updateData.categoryType = categoryType;
    } else {
      return res.status(400).json({ error: 'Either categoryId or categoryType is required' });
    }

    const result = await Task.updateMany(
      { 
        _id: { $in: taskIds },
        user: req.user._id
      },
      updateData
    );

    // Get updated tasks with populated category info
    const updatedTasks = await Task.find({
      _id: { $in: taskIds },
      user: req.user._id
    }).populate('category', 'name color icon');

    res.json({
      message: `${result.modifiedCount} tasks moved successfully`,
      modifiedCount: result.modifiedCount,
      tasks: updatedTasks
    });
  } catch (error) {
    console.error('Move to category error:', error);
    res.status(500).json({ error: 'Server error while moving tasks' });
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
