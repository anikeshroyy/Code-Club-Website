const mongoose = require('mongoose');

const joinApplicationSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  email:      { type: String, required: true, trim: true, lowercase: true },
  regNumber:  { type: String, required: true, trim: true },
  college:    { type: String, required: true, trim: true },
  branch:     { type: String, required: true, trim: true },
  year:       { type: String, required: true },
  phone:      { type: String, required: true },
  interests:  { type: String, default: '' },
  status:     { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminNotes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('JoinApplication', joinApplicationSchema);
