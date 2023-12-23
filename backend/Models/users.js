const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  gender: String,
  role: String,
  tnc: Boolean,
  photo: Buffer, // Update the photo field to use the Buffer type
});

module.exports = mongoose.model('User', userSchema);

