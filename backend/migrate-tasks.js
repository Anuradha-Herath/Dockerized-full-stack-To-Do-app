const mongoose = require('mongoose');
const Task = require('./models/Task');

async function migrateTasks() {
  try {
    // Connect to database
    await mongoose.connect('mongodb://localhost:27017/todoapp', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to database');

    // Update tasks that have string categories to use categoryType
    const updateResult = await Task.updateMany(
      { 
        categoryType: { $exists: false } // Tasks without categoryType field
      },
      [
        {
          $set: {
            categoryType: {
              $cond: {
                if: { $eq: ['$category', null] },
                then: 'all',
                else: {
                  $cond: {
                    if: { $eq: [{ $type: '$category' }, 'string'] },
                    then: '$category',
                    else: 'all'
                  }
                }
              }
            },
            category: {
              $cond: {
                if: { $eq: [{ $type: '$category' }, 'objectId'] },
                then: '$category',
                else: null
              }
            }
          }
        }
      ]
    );

    console.log(`Updated ${updateResult.modifiedCount} tasks`);

    // Close connection
    await mongoose.connection.close();
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateTasks();
}

module.exports = migrateTasks;
