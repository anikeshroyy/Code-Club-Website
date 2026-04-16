const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title:          { type: String, required: true, trim: true },
  description:    { type: String, default: '' },
  link:           { type: String, default: '' },
  category:       { type: String, enum: ['academic', 'platform', 'tool', 'other'], default: 'other' },
  type:           { type: String, enum: ['document', 'video', 'course', 'external', 'other'], default: 'external' },
  thumbnail:      { type: String, default: '' },
  thumbnailPublicId: { type: String, default: '' },
  order:          { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
