const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  province: { type: String, required: true },
  municipality: { type: String, required: true },
  street: { type: String, required: true },
  role: { type: String, default: 'user' },
  cp: { type: Number },
  phone: { type: Number },
});

module.exports = mongoose.model('User', userSchema);
