const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  speciality: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String, required: false },
  audioUrl: { type: String, required: false },
  imageUrl: { type: String, required: true },
  galleryImages: [{ type: String }], // Array to store gallery image URLs
  isPublished: { type: String, default: 'published' }, // Add the status field
 
});

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
