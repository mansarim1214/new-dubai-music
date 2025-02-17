const mongoose = require('mongoose');

const MusicStoreSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  bio: { type: String }, 
  contact: { type: String }, 
  logo: { type: String }, 
  featuredImage: { type: String }, 
  status: { type: String, default: 'published' }, 

});

module.exports = mongoose.model('MusicStore', MusicStoreSchema);
