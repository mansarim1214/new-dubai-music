const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');

// Mongoose schema definition
const weddingvipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String },
  imageUrl: { type: String, required: true },
  galleryImages: [{ type: String }], // Array to store multiple image paths
  category: { type: String, required: true }, // New category field
  isPublished: { type: String}, // Add the status field


});

// Mongoose model definition
const WeddingVIP = mongoose.model('WeddingVip', weddingvipSchema);

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

// POST route to add a new WeddingVIP with a single image and multiple gallery images
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'galleryImages', maxCount: 10 }]), async (req, res) => {
  const { title, description, videoUrl, category, isPublished } = req.body; // Include category

  const imageUrl = req.files['image'] ? `uploads/${req.files['image'][0].filename}` : '';
  const galleryImages = req.files['galleryImages'] ? req.files['galleryImages'].map(file => `uploads/${file.filename}`) : [];

  try {
    const newWeddingVIP = new WeddingVIP({ title, description, videoUrl, category, imageUrl, galleryImages, isPublished }); // Include category in new document
    await newWeddingVIP.save();
    res.status(201).json(newWeddingVIP);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET route to fetch all WeddingVIPs
router.get('/', async (req, res) => {
  try {
    const weddingvips = await WeddingVIP.find();
    res.json(weddingvips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET route to fetch a single WeddingVIP by ID
router.get('/:id', async (req, res) => {
  try {
    const weddingvip = await WeddingVIP.findById(req.params.id);
    if (weddingvip) {
      res.json(weddingvip);
    } else {
      res.status(404).json({ message: 'Wedding VIP not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT route to update a WeddingVIP by ID
router.put('/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'galleryImages', maxCount: 10 }]), async (req, res) => {
  const { title, description, videoUrl, category, isPublished } = req.body; // Include category in the update
  const updateData = { title, description, videoUrl, category, isPublished }; // Include category in update data

  try {
    if (req.files['image']) {
      updateData.imageUrl = `uploads/${req.files['image'][0].filename}`;
    }

    const weddingvip = await WeddingVIP.findById(req.params.id);
    if (!weddingvip) {
      return res.status(404).json({ message: 'Wedding VIP not found' });
    }

    if (req.files['galleryImages']) {
      const newGalleryImages = req.files['galleryImages'].map(file => `uploads/${file.filename}`);
      updateData.galleryImages = [...weddingvip.galleryImages, ...newGalleryImages];
    }

    const updatedWeddingVIP = await WeddingVIP.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedWeddingVIP);
  } catch (error) {
    console.error('Error updating Wedding VIP:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// DELETE route to delete a WeddingVIP by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedWeddingVIP = await WeddingVIP.findByIdAndDelete(req.params.id);
    if (deletedWeddingVIP) {
      res.json({ message: 'Wedding VIP deleted successfully' });
    } else {
      res.status(404).json({ message: 'Wedding VIP not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE route to remove a gallery image from the WeddingVIP's gallery
router.delete('/:id/gallery', async (req, res) => {
  const { id } = req.params;
  const { image } = req.body;

  try {
    const weddingvip = await WeddingVIP.findById(id);
    if (!weddingvip) return res.status(404).send('Wedding VIP not found');

    weddingvip.galleryImages = weddingvip.galleryImages.filter(img => img !== image);

    await weddingvip.save();
    res.send(weddingvip);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
