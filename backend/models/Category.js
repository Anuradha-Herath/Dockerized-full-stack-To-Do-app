const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
    minlength: 2
  },
  color: {
    type: String,
    enum: ['blue', 'green', 'purple', 'pink', 'yellow', 'red', 'indigo', 'teal'],
    default: 'blue'
  },
  icon: {
    type: String,
    default: 'Inbox'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure category names are unique per user (case-insensitive)
categorySchema.index({ user: 1, name: 1 }, { unique: true });

// Add text index for searching
categorySchema.index({ name: 'text' });

module.exports = mongoose.model('Category', categorySchema);
