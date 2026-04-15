const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title:            { type: String, required: true, trim: true },
  date:             { type: Date,   required: true },
  time:             { type: String, default: '' },
  location:         { type: String, default: '' },
  description:      { type: String, default: '' },
  imageUrl:         { type: String, default: '' },
  imagePublicId:    { type: String, default: '' },
  registrationLink: { type: String, default: '' },
  status:           { type: String, enum: ['Upcoming', 'Registration Open', 'Ongoing', 'Completed'], default: 'Upcoming' },
  isArchived:       { type: Boolean, default: false },
}, { timestamps: true });

// Auto-archive events whose date has passed
eventSchema.virtual('isUpcoming').get(function () {
  return !this.isArchived && this.date >= new Date();
});

module.exports = mongoose.model('Event', eventSchema);
