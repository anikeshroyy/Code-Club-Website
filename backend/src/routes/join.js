const express = require('express');
const JoinApplication = require('../models/JoinApplication');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/join  — public — submit membership application
router.post('/', async (req, res) => {
  try {
    const { name, email, regNumber, college, branch, year, phone, interests } = req.body;

    if (!name || !email || !regNumber || !college || !branch || !year || !phone) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const application = await JoinApplication.create({
      name, email, regNumber, college, branch, year, phone,
      interests: interests || '',
    });
    res.status(201).json({ message: 'Application submitted successfully', id: application._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/join  — protected — list all applications
router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const applications = await JoinApplication.find(filter).sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/join/:id  — protected — update application status
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const updated = await JoinApplication.findByIdAndUpdate(
      req.params.id,
      {
        ...(status     !== undefined && { status }),
        ...(adminNotes !== undefined && { adminNotes }),
      },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Application not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/join/:id  — protected
router.delete('/:id', auth, async (req, res) => {
  try {
    await JoinApplication.findByIdAndDelete(req.params.id);
    res.json({ message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
