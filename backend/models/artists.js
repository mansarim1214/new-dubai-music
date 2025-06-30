const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');

// Mongoose schema definition
const artistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  speciality: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String },
  audioUrl: { type: String },
  imageUrl: { type: String, required: true },
  galleryImages: [{ type: String }], // Array to store multiple image paths
  isPublished: { type: String, default: 'published' }, // Add the status field

});

// Mongoose model definition
const Artist = mongoose.model('Artist', artistSchema);

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// POST route to add a new artist with a single image and multiple gallery images
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'galleryImages', maxCount: 10 }]), async (req, res) => {
  const { title, category, speciality, description, videoUrl, audioUrl, isPublished } = req.body;

  const imageUrl = req.files['image'] ? `uploads/${req.files['image'][0].filename}` : '';
  const galleryImages = req.files['galleryImages'] ? req.files['galleryImages'].map(file => `uploads/${file.filename}`) : [];

  try {
    const newArtist = new Artist({ title, category, speciality, description, videoUrl, audioUrl, imageUrl, galleryImages, isPublished });
    await newArtist.save();
    res.status(201).json(newArtist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET route to fetch all artists
router.get('/', async (req, res) => {
  try {
    const artists = await Artist.find();
    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET route to fetch a single artist by ID
router.get('/:id', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (artist) {
      res.json(artist);
    } else {
      res.status(404).json({ message: 'Artist not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT route to update an artist by ID
router.put('/:id', upload.fields([
  { name: 'image', maxCount: 1 }, 
  { name: 'galleryImages', maxCount: 10 }
]), async (req, res) => {
  const { title, category, speciality, description, videoUrl, audioUrl, isPublished } = req.body;
  const updateData = { title, category, speciality, description, videoUrl, audioUrl, isPublished }; 

  try {
    if (req.files['image']) {
      updateData.imageUrl = `uploads/${req.files['image'][0].filename}`;
    }

    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    if (req.files['galleryImages']) {
      const newGalleryImages = req.files['galleryImages'].map(file => `uploads/${file.filename}`);
      updateData.galleryImages = [...artist.galleryImages, ...newGalleryImages];
    }

    const updatedArtist = await Artist.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedArtist);
  } catch (error) {
    console.error('Error updating artist:', error.message);  // Log the exact error message
    res.status(500).json({ message: 'Internal Server Error', error: error.message }); // Send a detailed error message to the client
  }
});


// DELETE route to delete an artist by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedArtist = await Artist.findByIdAndDelete(req.params.id);
    if (deletedArtist) {
      res.json({ message: 'Artist deleted successfully' });
    } else {
      res.status(404).json({ message: 'Artist not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE route to remove a gallery image from the artist's gallery
router.delete('/:id/gallery', async (req, res) => {
  const { id } = req.params; // Use id instead of artistId
  const { image } = req.body;

  try {
    const artist = await Artist.findById(id);
    if (!artist) return res.status(404).send('Artist not found');

    artist.galleryImages = artist.galleryImages.filter(img => img !== image);

    await artist.save();
    res.send(artist);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
