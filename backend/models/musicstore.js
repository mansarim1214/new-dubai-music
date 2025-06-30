const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const MusicStore = require('../models/MusicStore'); // Ensure the correct path for MusicStore model

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure 'uploads' directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage });

// POST route to add a new music store
router.post('/', upload.fields([{ name: 'logo' }, { name: 'featuredImage' }]), async (req, res) => {
  console.log('Received request to add music store:', req.body);
  const { name, bio, contact, status } = req.body;

  // Check if files were uploaded
  const logo = req.files['logo'] ? `uploads/${req.files['logo'][0].filename}` : null;
  const featuredImage = req.files['featuredImage'] ? `uploads/${req.files['featuredImage'][0].filename}` : null;

  try {
      const newMusicStore = new MusicStore({ name, bio, contact, logo, featuredImage, status });
      await newMusicStore.save();
      res.status(201).json(newMusicStore);
  } catch (error) {
      console.error('Error saving music store:', error);
      res.status(400).json({ message: error.message });
  }
});


// GET route to fetch all music stores
router.get('/', async (req, res) => {
  try {
    const musicStores = await MusicStore.find();
    res.json(musicStores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET route to fetch a single music store by ID
router.get('/:id', async (req, res) => {
  try {
    const musicStore = await MusicStore.findById(req.params.id);
    if (musicStore) {
      res.json(musicStore);
    } else {
      res.status(404).json({ message: 'Music Store not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT route to update a music store by ID
router.put('/:id', upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'featuredImage', maxCount: 1 }
]), async (req, res) => {
  const { name, bio, contact, status } = req.body;
  const updateData = { name, bio, contact, status };

  try {
    const musicStore = await MusicStore.findById(req.params.id);
    if (!musicStore) {
      return res.status(404).json({ message: 'Music Store not found' });
    }

  
    if (req.files['logo']) {
      updateData.logo = `uploads/${req.files['logo'][0].filename}`;
    }


    if (req.files['featuredImage']) {
      updateData.featuredImage = `uploads/${req.files['featuredImage'][0].filename}`;
    }

    const updatedMusicStore = await MusicStore.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedMusicStore);
  } catch (error) {
    console.error('Error updating music store:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// DELETE route to delete a music store by ID
router.delete('/:id', async (req, res) => {
  try {
      const storeId = req.params.id;
      const store = await MusicStore.findById(storeId);
      
      if (!store) {
          return res.status(404).json({ message: 'Store not found' });
      }

      // If you have associated files to delete, handle them here
      if (store.logo) {
          const logoPath = path.join(__dirname, '../', store.logo);
          fs.unlink(logoPath, (err) => {
              if (err) {
                  console.error('Error deleting logo:', err);
              } else {
                  console.log('Logo deleted successfully:', logoPath);
              }
          });
      }

      if (store.featuredImage) {
          const featuredImagePath = path.join(__dirname, '../', store.featuredImage);
          fs.unlink(featuredImagePath, (err) => {
              if (err) {
                  console.error('Error deleting featured image:', err);
              } else {
                  console.log('Featured image deleted successfully:', featuredImagePath);
              }
          });
      }

      await MusicStore.deleteOne({ _id: storeId });
      res.status(200).json({ message: 'Store deleted successfully' });
  } catch (error) {
      console.error('Error deleting store:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


module.exports = router;