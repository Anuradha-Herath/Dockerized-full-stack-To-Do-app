const express = require('express');
const auth = require('../middleware/auth');
const Category = require('../models/Category');
const router = express.Router();

// Get all categories for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.userId }).sort({ createdAt: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create a new category
router.post('/', auth, async (req, res) => {
  try {
    const { name, color = 'blue', icon = 'Inbox' } = req.body;

    // Validate required fields
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ error: 'Category name must be at least 2 characters' });
    }

    // Check if category already exists for this user
    const existingCategory = await Category.findOne({ 
      user: req.userId, 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });

    if (existingCategory) {
      return res.status(400).json({ error: 'Category with this name already exists' });
    }

    // Create new category
    const category = new Category({
      name: name.trim(),
      color,
      icon,
      user: req.userId
    });

    await category.save();

    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Category with this name already exists' });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ error: errors.join(', ') });
    }

    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update a category
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, color, icon } = req.body;
    const categoryId = req.params.id;

    // Find category and ensure it belongs to the authenticated user
    const category = await Category.findOne({ _id: categoryId, user: req.userId });
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if new name conflicts with existing category
    if (name && name.trim() !== category.name) {
      const existingCategory = await Category.findOne({ 
        user: req.userId, 
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
        _id: { $ne: categoryId }
      });

      if (existingCategory) {
        return res.status(400).json({ error: 'Category with this name already exists' });
      }
    }

    // Update category fields
    if (name) category.name = name.trim();
    if (color) category.color = color;
    if (icon) category.icon = icon;

    await category.save();

    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ error: errors.join(', ') });
    }

    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete a category
router.delete('/:id', auth, async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Find category and ensure it belongs to the authenticated user
    const category = await Category.findOne({ _id: categoryId, user: req.userId });
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Prevent deletion of default categories
    if (category.isDefault) {
      return res.status(400).json({ error: 'Cannot delete default categories' });
    }

    // Check if there are tasks associated with this category
    const Task = require('../models/Task');
    const tasksCount = await Task.countDocuments({ 
      user: req.userId, 
      category: categoryId 
    });

    if (tasksCount > 0) {
      return res.status(400).json({ 
        error: `Cannot delete category with ${tasksCount} task${tasksCount !== 1 ? 's' : ''}. Please move or delete the tasks first.` 
      });
    }

    await Category.findByIdAndDelete(categoryId);

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Get category statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const Task = require('../models/Task');
    
    const categories = await Category.find({ user: req.userId });
    const tasks = await Task.find({ user: req.userId });

    const stats = {};

    // Default category stats
    const defaultCategories = ['all', 'today', 'work', 'personal', 'important', 'completed', 'archived'];
    
    for (const categoryType of defaultCategories) {
      let categoryTasks = [];
      
      switch (categoryType) {
        case 'all':
          categoryTasks = tasks;
          break;
        case 'today':
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          categoryTasks = tasks.filter(task => {
            const taskDate = new Date(task.dueDate || task.createdAt);
            return taskDate >= today && taskDate < tomorrow;
          });
          break;
        case 'work':
        case 'personal':
        case 'important':
          categoryTasks = tasks.filter(task => task.categoryType === categoryType);
          break;
        case 'completed':
          categoryTasks = tasks.filter(task => task.completed);
          break;
        case 'archived':
          categoryTasks = tasks.filter(task => task.archived);
          break;
      }
      
      stats[categoryType] = {
        total: categoryTasks.length,
        completed: categoryTasks.filter(task => task.completed).length,
        pending: categoryTasks.filter(task => !task.completed).length
      };
    }

    // Custom category stats
    for (const category of categories) {
      const categoryTasks = tasks.filter(task => 
        task.category && task.category.toString() === category._id.toString()
      );
      stats[category._id] = {
        total: categoryTasks.length,
        completed: categoryTasks.filter(task => task.completed).length,
        pending: categoryTasks.filter(task => !task.completed).length
      };
    }

    res.json(stats);
  } catch (error) {
    console.error('Error fetching category statistics:', error);
    res.status(500).json({ error: 'Failed to fetch category statistics' });
  }
});

module.exports = router;
