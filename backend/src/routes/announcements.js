const express = require('express');
const Announcement = require('../models/Announcement');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/announcements  — public
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true }).sort({ date: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/announcements/all  — protected (includes inactive)
router.get('/all', auth, async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/announcements  — protected
router.post('/', auth, async (req, res) => {
  try {
    const { title, date, description, link, badge } = req.body;
    const announcement = await Announcement.create({
      title, date: new Date(date), description: description || '',
      link: link || '', badge: badge !== false,
    });
    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/announcements/:id  — protected
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, date, description, link, isNew, isActive } = req.body;
    const updated = await Announcement.findByIdAndUpdate(
      req.params.id,
      {
        ...(title !== undefined && { title }),
        ...(date  !== undefined && { date: new Date(date) }),
        ...(description !== undefined && { description }),
        ...(link  !== undefined && { link }),
        ...(badge    !== undefined && { badge }),
        ...(isActive !== undefined && { isActive }),
      },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Announcement not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/announcements/:id  — protected
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Announcement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Announcement not found' });
    res.json({ message: 'Announcement deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
