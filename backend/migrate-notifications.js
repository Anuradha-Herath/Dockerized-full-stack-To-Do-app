const mongoose = require('mongoose');
const User = require('./models/User');

async function migrateUserNotificationPreferences() {
  try {
    console.log('Starting user notification preferences migration...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for migration');

    // Update all users that don't have notification preferences
    const result = await User.updateMany(
      { 'preferences.notifications': { $exists: false } },
      {
        $set: {
          'preferences.notifications': {
            email: true,
            push: false,
            weekly: true
          }
        }
      }
    );

    console.log(`Migration completed. Updated ${result.modifiedCount} users.`);

    // Close the connection
    await mongoose.connection.close();
    console.log('Migration connection closed');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  require('dotenv').config();
  migrateUserNotificationPreferences();
}

module.exports = migrateUserNotificationPreferences;
