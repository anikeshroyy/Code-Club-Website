const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true },
  description:  { type: String, default: '' },
  imageUrl:     { type: String, required: true },
  imagePublicId: { type: String, required: true },
  categories:   { type: [String], default: [] },
  aspectRatio:  { type: String, default: '3/2' },
  order:        { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
