const mongoose = require('mongoose');

const weddingvipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String, required: false },
  audioUrl: { type: String, required: false },
  imageUrl: { type: String, required: true },
  galleryImages: [{ type: String }], // Array to store gallery image URLs
  category: { type: String, required: true }, // New category field
  isPublished: { type: String, default: 'published' }, // Add the status field

});

const WeddingVIP = mongoose.model('WeddingVip', weddingvipSchema);

module.exports = WeddingVIP;
