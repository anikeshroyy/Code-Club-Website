const express = require('express');
const Resource = require('../models/Resource');
const auth = require('../middleware/auth');
const { upload, uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload');

const router = express.Router();

// GET /api/resources  — public
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find().sort({ order: 1, createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/resources  — protected
router.post('/', auth, upload.single('thumbnail'), async (req, res) => {
  try {
    const { title, description, link, category, type, order } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    let thumbnail = '';
    let thumbnailPublicId = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'code-club/resources');
      thumbnail = result.secure_url;
      thumbnailPublicId = result.public_id;
    }

    const resource = await Resource.create({
      title,
      description: description || '',
      link: link || '',
      category: category || 'other',
      type: type || 'external',
      thumbnail,
      thumbnailPublicId,
      order: Number(order) || 0,
    });
    res.status(201).json(resource);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/resources/:id  — protected
router.put('/:id', auth, upload.single('thumbnail'), async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    const { title, description, link, category, type, order } = req.body;
    if (title)       resource.title       = title;
    if (description !== undefined) resource.description = description;
    if (link !== undefined)        resource.link        = link;
    if (category)    resource.category    = category;
    if (type)        resource.type        = type;
    if (order !== undefined) resource.order = Number(order);

    if (req.file) {
      if (resource.thumbnailPublicId) {
        await deleteFromCloudinary(resource.thumbnailPublicId);
      }
      const result = await uploadToCloudinary(req.file.buffer, 'code-club/resources');
      resource.thumbnail = result.secure_url;
      resource.thumbnailPublicId = result.public_id;
    }

    await resource.save();
    res.json(resource);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/resources/:id  — protected
router.delete('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    if (resource.thumbnailPublicId) {
      await deleteFromCloudinary(resource.thumbnailPublicId);
    }
    await resource.deleteOne();
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
