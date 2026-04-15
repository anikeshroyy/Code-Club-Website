const express = require('express');
const FacultyCoordinator = require('../models/FacultyCoordinator');
const auth = require('../middleware/auth');
const { upload, uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload');

const router = express.Router();

// GET /api/faculty  — public
router.get('/', async (req, res) => {
  try {
    const faculty = await FacultyCoordinator.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/faculty  — protected
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, position, department, order } = req.body;
    let imageUrl = '', imagePublicId = '';

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'codeclub/faculty');
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const coordinator = await FacultyCoordinator.create({
      name, position, department: department || '',
      imageUrl, imagePublicId,
      order: Number(order) || 0,
    });
    res.status(201).json(coordinator);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/faculty/:id  — protected
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const coordinator = await FacultyCoordinator.findById(req.params.id);
    if (!coordinator) return res.status(404).json({ message: 'Faculty not found' });

    const { name, position, department, order } = req.body;
    if (name)       coordinator.name       = name;
    if (position)   coordinator.position   = position;
    if (department) coordinator.department = department;
    if (order !== undefined) coordinator.order = Number(order);

    if (req.file) {
      if (coordinator.imagePublicId) await deleteFromCloudinary(coordinator.imagePublicId);
      const result = await uploadToCloudinary(req.file.buffer, 'codeclub/faculty');
      coordinator.imageUrl = result.secure_url;
      coordinator.imagePublicId = result.public_id;
    }

    await coordinator.save();
    res.json(coordinator);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/faculty/:id  — protected
router.delete('/:id', auth, async (req, res) => {
  try {
    const coordinator = await FacultyCoordinator.findById(req.params.id);
    if (!coordinator) return res.status(404).json({ message: 'Faculty not found' });

    if (coordinator.imagePublicId) await deleteFromCloudinary(coordinator.imagePublicId);
    await coordinator.deleteOne();
    res.json({ message: 'Faculty coordinator deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
