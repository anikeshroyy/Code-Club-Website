const express = require('express');
const TeamMember = require('../models/TeamMember');
const auth = require('../middleware/auth');
const { upload, uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload');

const router = express.Router();

// GET /api/team  — public
router.get('/', async (req, res) => {
  try {
    // Send all active members to the frontend, the frontend can filter isPastMember
    const members = await TeamMember.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/team  — protected
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, position, batch, isPastMember, order, linkedin, github, instagram } = req.body;
    let imageUrl = '', imagePublicId = '';

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'codeclub/team');
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const member = await TeamMember.create({
      name, position, batch: batch || '',
      imageUrl, imagePublicId,
      isPastMember: isPastMember === 'true',
      order: Number(order) || 0,
      social: { linkedin: linkedin || '', github: github || '', instagram: instagram || '' },
    });
    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/team/:id  — protected
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    const { name, position, batch, isPastMember, order, linkedin, github, instagram } = req.body;
    if (name)     member.name     = name;
    if (position) member.position = position;
    if (batch !== undefined) member.batch = batch;
    if (isPastMember !== undefined) member.isPastMember = isPastMember === 'true' || isPastMember === true;
    if (order !== undefined) member.order = Number(order);
    member.social = {
      linkedin:  linkedin  || member.social.linkedin,
      github:    github    || member.social.github,
      instagram: instagram || member.social.instagram,
    };

    if (req.file) {
      if (member.imagePublicId) await deleteFromCloudinary(member.imagePublicId);
      const result = await uploadToCloudinary(req.file.buffer, 'codeclub/team');
      member.imageUrl = result.secure_url;
      member.imagePublicId = result.public_id;
    }

    await member.save();
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/team/:id  — protected
router.delete('/:id', auth, async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    if (member.imagePublicId) await deleteFromCloudinary(member.imagePublicId);
    await member.deleteOne();
    res.json({ message: 'Member deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
