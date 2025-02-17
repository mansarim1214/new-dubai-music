const mongoose = require('mongoose');

const Venue = require('./models/Venue'); // Ensure the correct path to Venue model

// Connect to MongoDB
mongoose.connect('mongodb+srv://mansarim:4TCOflsMWdI9CCkt@cluster0.fawjsqk.mongodb.net/dubaimusic', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const updateVenuesStatusToDraft = async () => {
  try {
    const result = await Venue.updateMany(
      {}, // Empty filter to select all venues
      { $set: { status: 'draft' } } // Set status to 'draft'
    );
    console.log(`Updated ${result.modifiedCount} venues to draft.`);
  } catch (error) {
    console.error('Error updating venues:', error);
  } finally {
    mongoose.connection.close(); // Close the connection after completion
  }
};

// Run the update function
updateVenuesStatusToDraft();
