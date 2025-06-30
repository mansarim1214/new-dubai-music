const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const Venue = require('../models/Venue'); // Ensure the correct path


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// POST route to add a new venue
router.post('/', upload.fields([{ name: 'featuredImage' }, { name: 'gallery' }]), async (req, res) => {
  const { title, description, location, category, status, contact, orderNumber } = req.body; 
  const featuredImage = `uploads/${req.files['featuredImage'][0].filename}`;
  const gallery = req.files['gallery']?.map(file => `uploads/${file.filename}`) || [];

  try {
    const newVenue = new Venue({ title, description, location, category, featuredImage, gallery, status,contact,orderNumber, createdAt: new Date(), }); 
    await newVenue.save();
    res.status(201).json(newVenue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



// GET route to fetch all venues
router.get('/', async (req, res) => {
  try {
    const venues = await Venue.find();
    
    // Define "new" as added within the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const updatedVenues = venues.map(venue => {
      const isNew = new Date(venue.createdAt) >= sevenDaysAgo;
      return { ...venue._doc, isNew }; // Spread the original venue object and add isNew
    });

    res.json(updatedVenues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



//Update Venues Route
// PUT route to update a venue
router.put('/:id', upload.fields([
  { name: 'featuredImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 10 }
]), async (req, res) => {
  const { title, description, location, category, status, contact, orderNumber } = req.body; 
  const updateData = { title, description, location, category, status, contact, orderNumber };

  try {
    if (req.files['featuredImage']) {
      updateData.featuredImage = `uploads/${req.files['featuredImage'][0].filename}`;
    }

    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    if (req.files['galleryImages']) {
      const newGalleryImages = req.files['galleryImages'].map(file => `uploads/${file.filename}`);
      updateData.gallery = [...venue.gallery, ...newGalleryImages];
    }

    const updatedVenue = await Venue.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedVenue);
  } catch (error) {
    console.error('Error updating venue:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});



// GET route to fetch a single venue by ID
router.get('/:id', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id); // Find artist by ID
    if (venue) {
      res.json(venue); // Respond with the artist object if found
    } else {
      res.status(404).json({ message: 'Venue not found' }); // Handle case where Venue ID is not found
    }
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle server or database errors
  }
});

// DELETE route to delete a venue by id
router.delete('/:id', async (req, res) => {
  try {
    const venueId = req.params.id;
    const venue = await Venue.findOne({ _id: venueId });
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    await Venue.deleteOne({ _id: venueId });
    res.status(200).json({ message: 'Venue deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE route to remove a gallery image from the venue's gallery
router.delete('/:id/gallery', async (req, res) => {
  const { id } = req.params; // Use id instead of venueId
  const { image } = req.body;

  try {
    const venue = await Venue.findById(id);
    if (!venue) return res.status(404).send('Venue not found');

    // Remove the image from the gallery
    venue.gallery = venue.gallery.filter(img => img !== image);

    await venue.save();
    res.send(venue);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
