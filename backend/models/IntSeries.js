const mongoose = require('mongoose');

const IntSerSchema = new mongoose.Schema(
  {
    epno: { type: String },
    title: { type: String },
    description: { type: String },
    featuredImage: { type: String },
    gallery: { type: [String], default: [] },

    
    spotify: { type: String, default: "" },
    appleMusic: { type: String, default: "" },
    soundcloud: { type: String, default: "" },
    youtube: { type: String, default: "" },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true } 
);

module.exports = mongoose.model('IntSeries', IntSerSchema);
