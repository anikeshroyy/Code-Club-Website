const mongoose = require('mongoose');

const facultyCoordinatorSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  position:     { type: String, required: true, trim: true },
  department:   { type: String, default: '' },
  imageUrl:     { type: String, default: '' },
  imagePublicId: { type: String, default: '' },
  order:        { type: Number, default: 0 },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('FacultyCoordinator', facultyCoordinatorSchema);
