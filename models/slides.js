const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, default: null },
  description: String,
  button: String,
  color: String,
  btnDirection: String,
  wordsColor: String,
});

module.exports = mongoose.model('Slide', slideSchema);
