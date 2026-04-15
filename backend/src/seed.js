/**
 * Seeds the database with the first global admin account if none exists.
 * Runs automatically on server startup.
 */
const Admin = require('./models/Admin');

module.exports = async function seed() {
  try {
    const count = await Admin.countDocuments();
    if (count === 0) {
      await Admin.create({
        username: 'admin',
        password: 'admin62',  // Will be hashed by the pre-save hook
        role: 'global',
      });
      console.log('🌱  Seeded global admin — username: admin, password: admin62');
      console.log('⚠️   Please change the default password after first login!');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};
