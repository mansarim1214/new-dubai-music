const mongoose = require('mongoose');
const md5 = require('md5'); // Import the md5 library
const User = require('./models/User');

mongoose.connect('mongodb+srv://mansarim:4TCOflsMWdI9CCkt@cluster0.fawjsqk.mongodb.net/dubaimusic', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {

  // Hash the password using MD5
  const md5Hash = md5('@Dubaimusic1214');

  const user = new User({
    email: 'mansarim@dubaimusic.com',
    password: md5Hash, // Store the hashed password
    role: 'admin',
  });

  await user.save();
  console.log('Admin user created');
  mongoose.disconnect();
}).catch((error) => {
  console.error('Error creating user:', error);
});
