const express = require('express');
const GalleryImage = require('../models/GalleryImage');
const auth = require('../middleware/auth');
const { upload, uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload');

const router = express.Router();

// GET /api/gallery  — public
router.get('/', async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ order: 1, createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/gallery  — protected
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image file is required' });

    const { title, description, categories, aspectRatio, order } = req.body;

    const result = await uploadToCloudinary(req.file.buffer, 'code-club/gallery');

    // categories can be sent as CSV string or JSON array
    let cats = [];
    if (categories) {
      try { cats = JSON.parse(categories); } catch { cats = categories.split(',').map(c => c.trim()); }
    }

    const image = await GalleryImage.create({
      title, description: description || '',
      imageUrl: result.secure_url,
      imagePublicId: result.public_id,
      categories: cats,
      aspectRatio: aspectRatio || '3/2',
      order: Number(order) || 0,
    });
    res.status(201).json(image);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/gallery/:id  — protected
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    const { title, description, categories, aspectRatio, order } = req.body;
    if (title)       image.title       = title;
    if (description !== undefined) image.description = description;
    if (aspectRatio) image.aspectRatio = aspectRatio;
    if (order !== undefined) image.order = Number(order);

    if (categories) {
      try { image.categories = JSON.parse(categories); }
      catch { image.categories = categories.split(',').map(c => c.trim()); }
    }

    if (req.file) {
      await deleteFromCloudinary(image.imagePublicId);
      const result = await uploadToCloudinary(req.file.buffer, 'codeclub/gallery');
      image.imageUrl = result.secure_url;
      image.imagePublicId = result.public_id;
    }

    await image.save();
    res.json(image);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/gallery/:id  — protected
router.delete('/:id', auth, async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    await deleteFromCloudinary(image.imagePublicId);
    await image.deleteOne();
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
