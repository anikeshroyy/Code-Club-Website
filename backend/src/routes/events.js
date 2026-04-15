const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const { upload, uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload');

const router = express.Router();

// GET /api/events  — public — returns upcoming (non-archived) events, sorted by date
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ isArchived: false }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events/latest  — public — returns 3 latest upcoming events for home page
router.get('/latest', async (req, res) => {
  try {
    const events = await Event.find({ isArchived: false })
      .sort({ date: 1 })
      .limit(3);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events/archived  — public — archived/past events
router.get('/archived', async (req, res) => {
  try {
    const events = await Event.find({ isArchived: true }).sort({ date: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events/all  — protected — all events regardless of archive status
router.get('/all', auth, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/events  — protected
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, date, time, location, description, registrationLink, status } = req.body;
    let imageUrl = '', imagePublicId = '';

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'codeclub/events');
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const event = await Event.create({
      title, date: new Date(date), time: time || '',
      location: location || '', description: description || '',
      imageUrl, imagePublicId,
      registrationLink: registrationLink || '',
      status: status || 'Upcoming',
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/events/:id  — protected
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const { title, date, time, location, description, registrationLink, status, isArchived } = req.body;
    if (title)             event.title            = title;
    if (date)              event.date             = new Date(date);
    if (time !== undefined) event.time            = time;
    if (location !== undefined) event.location    = location;
    if (description !== undefined) event.description = description;
    if (registrationLink !== undefined) event.registrationLink = registrationLink;
    if (status)            event.status           = status;
    if (isArchived !== undefined) event.isArchived = isArchived === 'true' || isArchived === true;

    if (req.file) {
      if (event.imagePublicId) await deleteFromCloudinary(event.imagePublicId);
      const result = await uploadToCloudinary(req.file.buffer, 'codeclub/events');
      event.imageUrl = result.secure_url;
      event.imagePublicId = result.public_id;
    }

    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/events/:id  — protected
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.imagePublicId) await deleteFromCloudinary(event.imagePublicId);
    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
