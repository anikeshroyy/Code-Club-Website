const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  position:      { type: String, required: true, trim: true },
  batch:         { type: String, default: '' },          // e.g. "2022-2026"
  imageUrl:      { type: String, default: '' },
  imagePublicId: { type: String, default: '' },
  social: {
    linkedin:  { type: String, default: '' },
    github:    { type: String, default: '' },
    instagram: { type: String, default: '' },
  },
  order:        { type: Number,  default: 0 },
  isActive:     { type: Boolean, default: true },
  isPastMember: { type: Boolean, default: false },  // true = show in alumni section
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
