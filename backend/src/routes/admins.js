const express = require('express');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require auth
router.use(auth);

// GET /api/admins  — list all admins (global only)
router.get('/', async (req, res) => {
  try {
    if (req.admin.role !== 'global')
      return res.status(403).json({ message: 'Access denied' });
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admins  — create admin (global only)
router.post('/', async (req, res) => {
  try {
    if (req.admin.role !== 'global')
      return res.status(403).json({ message: 'Access denied' });

    const { username, password, role } = req.body;
    const exists = await Admin.findOne({ username });
    if (exists) return res.status(400).json({ message: 'Username already exists' });

    const admin = await Admin.create({ username, password, role: role || 'admin' });
    res.status(201).json({ id: admin._id, username: admin.username, role: admin.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admins/:id/reset-password  — global admin resets any admin's password
router.put('/:id/reset-password', async (req, res) => {
  try {
    if (req.admin.role !== 'global')
      return res.status(403).json({ message: 'Access denied' });

    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    admin.password = req.body.newPassword;
    await admin.save();
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admins/:id  — global only
router.delete('/:id', async (req, res) => {
  try {
    if (req.admin.role !== 'global')
      return res.status(403).json({ message: 'Access denied' });

    if (req.params.id === req.admin.id)
      return res.status(400).json({ message: 'Cannot delete yourself' });

    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: 'Admin deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
