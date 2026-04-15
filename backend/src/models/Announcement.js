const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  date:        { type: Date,   required: true },
  description: { type: String, default: '' },
  link:        { type: String, default: '' },
  badge:       { type: Boolean, default: true },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
