const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  province: { type: String, required: true },
  town: { type: String, required: true },
  street: { type: String, required: true },
  numberStreet: { type: String, required: true },
  role: { type: String, default: 'user' },
  instructions: { type: String },
  cp: { type: Number },
  phone: { type: Number },
  building: { type: Boolean, default: false },
  createdAt: { type: String, default: Date.now },
  favorites: [{}],
});

module.exports = mongoose.model('User', userSchema);
