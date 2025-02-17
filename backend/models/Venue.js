const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  title: { type: String},
  description: { type: String },
  location: { type: String },
  category: { type: String },
  featuredImage: { type: String },
  gallery: { type: [String], default: [] },
  contact: { type: String },
  status: { type: String, default: 'published' },
  createdAt: {type: Date}
}, { Timestamp: true }); // This enables the `createdAt` and `updatedAt` fields

module.exports = mongoose.model('Venue', VenueSchema);
