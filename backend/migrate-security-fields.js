const mongoose = require('mongoose');

// Migration script to add security fields to existing users
async function migrateUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      name: String,
      googleId: String,
      // Add new security fields
      googleRefreshToken: String,
      googleAccessToken: String,
      googleTokenExpiry: Date,
      loginAttempts: { type: Number, default: 0 },
      lockUntil: Date,
      lastFailedLogin: Date,
      lastLogin: Date
    }));

    // Find all users that need migration
    const users = await User.find({
      $or: [
        { loginAttempts: { $exists: false } },
        { googleRefreshToken: { $exists: false } }
      ]
    });

    console.log(`Found ${users.length} users to migrate`);

    // Update each user with default security values
    for (const user of users) {
      const updateData = {};

      if (user.loginAttempts === undefined) {
        updateData.loginAttempts = 0;
      }

      if (user.googleRefreshToken === undefined) {
        updateData.googleRefreshToken = null;
        updateData.googleAccessToken = null;
        updateData.googleTokenExpiry = null;
      }

      if (Object.keys(updateData).length > 0) {
        await User.findByIdAndUpdate(user._id, updateData);
        console.log(`Migrated user: ${user.email}`);
      }
    }

    console.log('Migration completed successfully');

    // Optional: Clean up any orphaned data
    const cleanupResult = await User.updateMany(
      { lockUntil: { $lt: new Date() } },
      { $unset: { lockUntil: 1 }, $set: { loginAttempts: 0 } }
    );

    if (cleanupResult.modifiedCount > 0) {
      console.log(`Cleaned up ${cleanupResult.modifiedCount} expired lockouts`);
    }

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  require('dotenv').config();
  migrateUsers();
}

module.exports = migrateUsers;